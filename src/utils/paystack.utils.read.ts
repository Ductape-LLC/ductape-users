import { PaystackCustomerModel } from "../models/paystack.model";
import { handleError } from "../errors/errors";
import { PaystackCustomer } from "../types/paystack.type";

export const findOne = async(query: any): Promise<PaystackCustomer | null> => {
    try {
        return await PaystackCustomerModel.findOne(query)
            .select({
                user_id: 1,
                customer_code: 1,
                email: 1,
                authorization: {
                    last4: 1,
                    exp_month: 1,
                    exp_year: 1,
                    card_type: 1,
                    bank: 1
                },
                status: 1
            })
            .lean();
    } catch(e) {
        throw handleError(e);
    }
}

export const find = async(query: any): Promise<Array<PaystackCustomer>> => {
    try {
        return await PaystackCustomerModel.find(query);
    } catch(e) {
        throw handleError(e);
    }
}