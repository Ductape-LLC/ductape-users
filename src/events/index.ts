import { confirmUserEmailEvent, forgotUserEmailEvent, sendOTPEmailEvent } from "../types/confirm.type";
import { sendConfirmationEmail, sendForgotEmail, sendOTPEmail } from "./user.events.emails";
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
            default:
                throw `${event} not handled`;
        }
    } catch (e) {
        throw e;
    }
}

export default EVENTBROKER;