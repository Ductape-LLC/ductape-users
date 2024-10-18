export enum EventType {
    CONFIRM_EMAIL = "CONFIRM_EMAIL",
    FORGOT_EMAIL = "FORGOT_EMAIL",
    SEND_OTP = "SEND_OTP"
};

export enum UserStatus {
    ACTIVE = "active",
    TEMPORARY = "temporary",
};

export interface EventRequest {
    event: EventType,
    data: Record<string, unknown>
};