import { model } from "../models/roles.model";
import { handleError } from "../errors/errors";
import { IRole } from "../types/permission.type";

export const findByIdAndUpdate = async (id: unknown, set: Partial<IRole>): Promise<IRole | any> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}}, { upsert: true, new: true });
        return update
    } catch(e){
        throw handleError(e);
    }
}