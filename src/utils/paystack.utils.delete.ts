import { PaystackCustomerModel } from "../models/paystack.model";
import { handleError } from "../errors/errors";

export const deleteOne = async(query: any): Promise<boolean> => {
    try {
        const result = await PaystackCustomerModel.deleteOne(query);
        return result.deletedCount > 0;
    } catch(e) {
        throw handleError(e);
    }
}