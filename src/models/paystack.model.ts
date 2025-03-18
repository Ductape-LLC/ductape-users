import mongoose from "mongoose";
import { UserStatus } from "../events/user.events.types";
import { PaystackCustomer } from "../types/paystack.type";

const schema = new mongoose.Schema<PaystackCustomer>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    customer_code: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    authorization: {
        authorization_code: String,
        card_type: String,
        last4: String,
        exp_month: String,
        exp_year: String,
        bin: String,
        bank: String,
        channel: String,
        signature: String,
        reusable: Boolean,
        country_code: String
    },
    status: {
        type: String,
        enum: UserStatus,
        required: true
    },
    domain: String,
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

export const PaystackCustomerModel = mongoose.model('paystack_customer', schema);