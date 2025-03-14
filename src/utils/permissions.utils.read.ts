import { IPermission } from "../types/permission.type";
import { model } from "../models/permissions.model";

export const find = async (get: any): Promise<Array<IPermission>> => {
    try{
        const data = await model.find(get).sort({ category: 1, name: 1 });
        return data
    } catch(e){
        throw e;
    }
}

export const findById = async (id: string): Promise<any> => {
    try{

        return await model.findById(id);

    } catch (e){
        throw e;
    }
}

export const findOne = async (data: any): Promise<IPermission> => {
    try {
        return await model.findOne({ ...data }) as unknown as IPermission;
    } catch (e) {
        throw e;
    }
}