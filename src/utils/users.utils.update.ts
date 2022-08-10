import { PipelineStage } from "mongoose";
import { model } from "../models/users.model";
import { users } from "../types/users.type";

export const updateUser =async (id: unknown, set: Partial<users>): Promise<boolean> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw e;
    }
}

export const updateUserByEmail =async (email: unknown, set: Partial<users>): Promise<boolean> => {
    try{
        const update = await model.findOneAndUpdate(email, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw e;
    }
}

export const updateMultipleUsers =async (get: object, set: Partial<users>): Promise<boolean> => {
    try{
        const update = await model.updateMany(get, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw e;
    }
}