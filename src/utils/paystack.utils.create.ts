import { PaystackCustomerModel } from "../models/paystack.model";
import { handleError } from "../errors/errors";
import { PaystackCustomer } from "../types/paystack.type";

export const create = async(payload: Partial<PaystackCustomer>): Promise<PaystackCustomer> => {
    try {
        return await PaystackCustomerModel.create(payload);
    } catch(e) {
        throw handleError(e);
    }
}