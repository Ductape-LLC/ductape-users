export enum EventType {
    CONFIRM_EMAIL = "CONFIRM_EMAIL",
    FORGOT_EMAIL = "FORGOT_EMAIL",
    FIND_EMAIL_AND_UPDATE_USER_ID = "FIND_EMAIL_AND_UPDATE_USER_ID",
};

export interface EventRequest {
    event: EventType,
    data: Record<string, unknown>
};