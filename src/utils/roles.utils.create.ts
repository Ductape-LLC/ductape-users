import { model } from "../models/roles.model";
import { handleError } from "../errors/errors";
import { IRole } from "../types/permission.type";

export const create = async(payload: IRole): Promise<IRole| any> =>{
    try{
        const create = await model.create(payload);
        return create;
    } catch(e) {
        
        throw handleError(e);
    }
}
