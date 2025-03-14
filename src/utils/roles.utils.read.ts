import { IRole } from "../types/permission.type";
import { model } from "../models/roles.model";

export const find = async (get: any): Promise<Array<IRole | any>> => {
    try {
        const data = await model.find(get).populate('permissions');
        return data;
    } catch(e) {
        throw e;
    }
}

export const findById = async (id: string): Promise<any> => {
    try {
        return await model.findById(id).populate('permissions');
    } catch (e) {
        throw e;
    }
}

export const findOne = async (data: any): Promise<IRole> => {
    try {
        return await model.findOne({ ...data }).populate('permissions') as unknown as IRole;
    } catch (e) {
        throw e;
    }
}