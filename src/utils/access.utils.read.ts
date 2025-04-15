import { model } from "../models/access.model";
import { access } from "../types/access.type";


export const findOne = async (data: any): Promise<access> => {
    try {
        return await model.findOne({ ...data }) as unknown as access;
    } catch (e) {
        throw e;
    }
}