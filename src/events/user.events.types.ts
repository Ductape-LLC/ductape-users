export enum EventType {
    CONFIRM_EMAIL = "CONFIRM_EMAIL",
    FORGOT_EMAIL = "FORGOT_EMAIL",
    SEND_OTP = "SEND_OTP",
    SUBSCRIPTION_CHARGE = "SUBSCRIPTION_CHARGE",
    WORKSPACE_GENERATE_BILLING_REPORT = "WORKSPACE_GENERATE_BILLING_REPORT",
};

export enum UserStatus {
    ACTIVE = "active",
    TEMPORARY = "temporary",
};

export interface EventRequest {
    event: EventType,
    data: Record<string, unknown>
};