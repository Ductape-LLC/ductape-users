import { Request, Response, NextFunction } from 'express';
import { Subscription, BillingReport } from '../models/subscriptions.model';
import { model as Access } from '../models/access.model';
import { BillingResponse, PricingChargeResponse, SubscriptionStatus } from '../types/subscription.types';
import ERROR from '../commons/errorResponse';
import { EventType } from '../events/user.events.types';
import EVENTBROKER from '../events';
import { IAuthRepo, AuthRepo } from '../repo/auth.repo';
import { AccessTypes } from '../types/access.type';

const authRepo: IAuthRepo = AuthRepo;

export const checkSubscriptionExpiration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json(ERROR('Validation Failed'));
    }

    const workspaceAccesses = await Access.find({ user_id: user._id, access_level: AccessTypes.OWNER })
      .select('workspace_id')
      .lean();

    const workspaceIds = workspaceAccesses.map((access) => access.workspace_id);

    if (!workspaceIds.length) {
      return res.status(403).json(ERROR('No workspace access found'));
    }

    const now = new Date();
    const activeSubscriptions = await Subscription.find({
      workspace_id: { $in: workspaceIds },
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: { $lte: now },
    })
      .populate('plan_id')
      .lean();

    if (!activeSubscriptions.length) {
      console.log('No active subscriptions found');
    } else {
      if (activeSubscriptions.length) {
        await Promise.all(
          activeSubscriptions.map((subscription) =>
            processExpiredSubscription(subscription, user?._id as unknown as string),
          ),
        );
      }
    }

    next();
  } catch (error) {
    console.error('Subscription charge error:', error);
    return res.status(500).json(ERROR('Failed to process subscription charge'));
  }
};

async function processExpiredSubscription(subscription: any, userId: string): Promise<void> {
  try {
    const auth = await authRepo.generateModuleAuthJWT('100y');

    const billingReport = await generateBillingReport(subscription.workspace_id, userId);

    if (billingReport.amount <= 0) {
      console.log(`Skipping charge for subscription ${subscription._id} - amount is 0`);
      return;
    }

    await updateSubscriptionStatus(subscription);
    await schedulePaymentRetry(billingReport, auth);
  } catch (error) {
    console.error(`Failed to charge subscription for workspace ${subscription.workspace_id}:`, error);
    throw error;
  }
}

async function generateBillingReport(workspaceId: string, user_id: string) {
  const auth = await authRepo.generateModuleAuthJWT('100y');
  const response = (await EVENTBROKER({
    event: EventType.WORKSPACE_GENERATE_BILLING_REPORT,
    data: { auth, data: { workspace_id: workspaceId } },
  })) as BillingResponse;

  const { currentBillingReport, planChangeHistory } = response.data;

  return {
    workspace_id: currentBillingReport.workspace_id,
    user_id: user_id,
    billing_report_id: currentBillingReport._id,
    subscription_id: currentBillingReport.subscription_id,
    prev_billing_report_id: planChangeHistory?.previousPlanReport.billingReport._id,
    amount: planChangeHistory
      ? currentBillingReport.totalCost + planChangeHistory.previousPlanReport.planDetails.oldPlanUsedAmount
      : currentBillingReport.totalCost,
  };
}

async function updateSubscriptionStatus(subscription: any): Promise<void> {
  await Subscription.findByIdAndUpdate(
    subscription._id,
    { $set: { status: SubscriptionStatus.EXPIRED } },
    { new: true },
  );
}

async function schedulePaymentRetry(billingDetails: any, auth: string, attempt: number = 1): Promise<void> {
  try {
    const payment = await EVENTBROKER({
      event: EventType.SUBSCRIPTION_CHARGE,
      data: { auth, data: billingDetails },
    });

    console.log("PAYMENT :::", payment)

    if (payment.data.data.status === 'success') {
      await updateBillingReport(billingDetails.billing_report_id, payment);
      if (billingDetails.prev_billing_report_id) await updateBillingReport(billingDetails.prev_billing_report_id, payment);
      console.log(`Payment successful for subscription ${billingDetails.subscription_id}`);
      return;
    }

    if (attempt < 3) {
      const nextRetryHours = Math.pow(2, attempt - 1) * 24;
      setTimeout(() => {
        schedulePaymentRetry(billingDetails, auth, attempt + 1);
      }, nextRetryHours * 60 * 60 * 1000);
    } else {
      console.error(`Final payment attempt failed for subscription ${billingDetails.subscription_id}`);
    }
  } catch (error) {
    console.error(`Payment attempt ${attempt} failed:`, error);
  }
}

async function updateBillingReport(reportId: string, payment: PricingChargeResponse): Promise<void> {
  await BillingReport.findByIdAndUpdate(reportId, {
    paid: true,
    paidAt: payment.data.paid_at,
    payment_reference: payment.data.reference,
  });
}
