import mongoose from "mongoose";

export interface PaystackCustomer {
    user_id: mongoose.Types.ObjectId;
    customer_code: string;
    email: string;
    authorization: {
        authorization_code: string;
        card_type: string;
        last4: string;
        exp_month: string;
        exp_year: string;
        bin: string;
        bank: string;
        channel: string;
        signature: string;
        reusable: boolean;
        country_code: string;
    };
    status: string;
    domain: string;
    metadata: Record<string, any>;
}