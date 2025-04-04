import { PaystackCustomerModel } from "../models/paystack.model";
import { handleError } from "../errors/errors";
import { PaystackCustomer } from "../types/paystack.type";

export const updateUser =async (id: unknown, set: Partial<PaystackCustomer>): Promise<PaystackCustomer> => {
    try{
        const update = await PaystackCustomerModel.findByIdAndUpdate(id, {$set: {...set}}, { upsert: true, new: true });

        return update
    } catch(e){
        throw handleError(e);
    }
}