import { model } from "../models/permissions.model";
import { handleError } from "../errors/errors";
import { IPermission } from "../types/permission.type";

export const findByIdAndUpdate = async (id: unknown, set: Partial<IPermission>): Promise<IPermission> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}}, { upsert: true, new: true });
        return update
    } catch(e){
        throw handleError(e);
    }
}

export const findOneAndUpdate = async (payload: Partial<IPermission>, set: Partial<IPermission>): Promise<IPermission> => {
    try{
        const update = await model.findOneAndUpdate(payload, {$set: {...set}}, { upsert: true, new: true });
        return update
    } catch(e){
        throw handleError(e);
    }
}