import { model } from "../models/permissions.model";
import { handleError } from "../errors/errors";
import { IPermission } from "../types/permission.type";

export const create = async(payload: IPermission): Promise<IPermission> =>{
    try{
        const create = await model.create(payload);
        return create;
    } catch(e) {
        
        throw handleError(e);
    }
}
