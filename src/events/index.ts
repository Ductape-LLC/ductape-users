import { confirmUserEmailEvent, forgotUserEmailEvent } from "../types/confirm.type";
import { sendConfirmationEmail, sendForgotEmail } from "./user.events.emails";
import { EventRequest, EventType } from "./user.events.types";

const EVENTBROKER = async (eventRequest: EventRequest): Promise<any> => {

    const {event, data} = eventRequest;

    try {
        switch (event) {
            case EventType.CONFIRM_EMAIL:
                return await sendConfirmationEmail(data as unknown as confirmUserEmailEvent);
            case EventType.FORGOT_EMAIL:
                return await sendForgotEmail(data as unknown as forgotUserEmailEvent)
            default:
                throw `${event} not handled`;
        }
    } catch (e) {
        throw e;
    }
}

export default EVENTBROKER;