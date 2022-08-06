export enum EventType {
    CONFIRM_EMAIL = "CONFIRM_EMAIL",
    FORGOT_EMAIL = "FORGOT_EMAIL",
};

export interface EventRequest {
    event: EventType,
    data: Record<string, unknown>
};