import mongoose, { Schema } from 'mongoose';
import { IBillingReport, IPlanChangeHistory, ISubscription, ISubscriptionPlan, SubscriptionStatus } from '../types/subscription.types';

const PricingPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true, unique: true, trim: true },
  tag: { type: String, required: true, unique: true, trim: true },
  isEnterprise: { type: Boolean, required: true, default: false },
  monthlyPrice: { type: Number, default: null },
  description: { type: String, required: true },
  users: { type: Number, default: null },
  monthlyRequests: { type: Number, default: null},
  fileTransfer: { type: Number },
  apps: { type: Number, default: null },
  products: { type: Number, default: null },
  logsRetentionDays: { type: Number, default: null },
  usageDataRetentionDays: { type: Number, default: null },
  productLimits: {
    type: {
      caches: Number,
      databases: Number,
      actions: Number,
      storageUnits: Number,
      messageBrokers: Number,
      notifiers: Number,
      jobs: Number,
      cloudFunctions: Number,
    },
    default: null
  },
  marketplaceAccess: {
    canPublish: { type: Boolean, required: true, default: false },
    revenueShare: { type: Number, required: true, min: 0, max: 100, default: 0 }
  },
  usagePricing: {
    additionalRequestPrice: { type: Number, required: true, default: 0 },
    additionalStoragePrice: { type: Number, required: true, default: 0 }
  },
  isPayAsYouGo: { type: Boolean, required: true, default: false },
  resourcePricing: {
    type: {
      action: Number,
      cache: Number,
      database: Number,
      storage: Number,
      messageBroker: Number,
      notifier: Number,
      job: Number,
      cloudFunction: Number,
      log: Number,
      app: Number,
      product: Number,
      user: Number
    },
    default: undefined
  },
  customFeatures: [{ type: String, trim: true }]
}, {
  timestamps: true,
  versionKey: false
});

const SubscriptionSchema = new Schema<ISubscription>({
  plan_id: { type: Schema.Types.ObjectId, required: true, ref: 'subscription_plan' },
  workspace_id: { type: Schema.Types.ObjectId, required: true, ref: 'workspaces' },
  status: { 
    type: String, 
    enum: Object.values(SubscriptionStatus),
    required: true,
    default: SubscriptionStatus.ACTIVE 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true },
  lastBillingDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  cancelledAt: { type: Date }
}, {
  timestamps: true,
  versionKey: false
});

const PlanChangeHistorySchema = new Schema<IPlanChangeHistory>({
  workspace_id: { type: Schema.Types.ObjectId, required: true, ref: 'workspaces' },
  subscription_id: { type: Schema.Types.ObjectId, required: true, ref: 'subscription' },
  oldPlanId: { type: Schema.Types.ObjectId, required: true, ref: 'subscription_plan' },
  newPlanId: { type: Schema.Types.ObjectId, required: true, ref: 'subscription_plan' },
  changeDate: { type: Date, required: true },
  effectiveDate: { type: Date, required: true },
  reason: { type: String }
}, {
  timestamps: true,
  versionKey: false
});

const BillingReportSchema = new Schema<IBillingReport>({
  workspace_id: { type: Schema.Types.ObjectId, required: true, ref: 'workspaces' },
  subscription_id: { type: Schema.Types.ObjectId, required: true, ref: 'subscription' },
  plan_id: { type: Schema.Types.ObjectId, required: true, ref: 'subscription_plan' },
  billingPeriodStart: { type: Date, required: true },
  billingPeriodEnd: { type: Date, required: true },
  basePrice: { type: Number, required: true },
  resourceUsage: {
    actions: { type: Number, required: true, default: 0 },
    caches: { type: Number, required: true, default: 0 },
    databases: { type: Number, required: true, default: 0 },
    storage: { type: Number, required: true, default: 0 },
    messageBrokers: { type: Number, required: true, default: 0 },
    notifiers: { type: Number, required: true, default: 0 },
    jobs: { type: Number, required: true, default: 0 },
    cloudFunctions: { type: Number, required: true, default: 0 },
    logs: { type: Number, required: true, default: 0 },
    apps: { type: Number, required: true, default: 0 },
    products: { type: Number, required: true, default: 0 },
    users: { type: Number, required: true, default: 0 },
    requests: { type: Number, required: true, default: 0 },
    fileTransfer: { type: Number, required: true, default: 0 }
  },
  resourceCosts: {
    actions: { type: Number, required: true, default: 0 },
    caches: { type: Number, required: true, default: 0 },
    databases: { type: Number, required: true, default: 0 },
    storage: { type: Number, required: true, default: 0 },
    messageBrokers: { type: Number, required: true, default: 0 },
    notifiers: { type: Number, required: true, default: 0 },
    jobs: { type: Number, required: true, default: 0 },
    cloudFunctions: { type: Number, required: true, default: 0 },
    logs: { type: Number, required: true, default: 0 },
    apps: { type: Number, required: true, default: 0 },
    products: { type: Number, required: true, default: 0 },
    users: { type: Number, required: true, default: 0 },
    requests: { type: Number, required: true, default: 0 },
    fileTransfer: { type: Number, required: true, default: 0 }
  },
  totalCost: { type: Number, required: true },
  paid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  payment_reference: { type: String }
}, {
  timestamps: true,
  versionKey: false
});

PricingPlanSchema.index({ name: 1 }, { unique: true });
PricingPlanSchema.index({ tag: 1 }, { unique: true });
PricingPlanSchema.index({ isEnterprise: 1 });
PricingPlanSchema.index({ isPayAsYouGo: 1 });

SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ planId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ nextBillingDate: 1 });

PlanChangeHistorySchema.index({ userId: 1 });
PlanChangeHistorySchema.index({ subscriptionId: 1 });
PlanChangeHistorySchema.index({ changeDate: 1 });

BillingReportSchema.index({ userId: 1 });
BillingReportSchema.index({ subscriptionId: 1 });
BillingReportSchema.index({ billingPeriodStart: 1, billingPeriodEnd: 1 });
BillingReportSchema.index({ paid: 1 });

export const model = mongoose.model<ISubscriptionPlan>('subscription_plan', PricingPlanSchema);
export const Subscription = mongoose.model<ISubscription>('subscription', SubscriptionSchema);
export const PlanChangeHistory = mongoose.model<IPlanChangeHistory>('plan_change_history', PlanChangeHistorySchema);
export const BillingReport = mongoose.model<IBillingReport>('billing_report', BillingReportSchema);
