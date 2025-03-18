import { handleError } from "../errors/errors";
import { confirmUserEmailEvent, forgotUserEmailEvent, sendOTPEmailEvent } from "../types/confirm.type";
import { sendConfirmationEmail, sendForgotEmail, sendOTPEmail } from "./user.events.emails";
import { subscriptionCharge, workspaceGenerateBillingReport } from "./user.events.subscription";
import { EventRequest, EventType } from "./user.events.types";

const EVENTBROKER = async (eventRequest: EventRequest): Promise<any> => {

    const {event, data} = eventRequest;

    try {
        switch (event) {
            case EventType.CONFIRM_EMAIL:
                return await sendConfirmationEmail(data as unknown as confirmUserEmailEvent);
            case EventType.FORGOT_EMAIL:
                return await sendForgotEmail(data as unknown as forgotUserEmailEvent);
            case EventType.SEND_OTP:
                return await sendOTPEmail(data as unknown as sendOTPEmailEvent);
            case EventType.SUBSCRIPTION_CHARGE:
                return await subscriptionCharge(data as unknown as { auth: string; data: any });
            case EventType.WORKSPACE_GENERATE_BILLING_REPORT:
                return await workspaceGenerateBillingReport(data as unknown as { auth: string; data: any });
            default:
                throw `${event} not handled`;
        }
    } catch (e) {
        throw handleError(e);
    }
}

export default EVENTBROKER;