import { PipelineStage } from "mongoose";
import { model } from "../models/forgot.model";
import { confirmUser as forgotUser } from "../types/confirm.type";
import { handleError } from "../errors/errors";

export const updateForgot =async (id: unknown, set: Partial<forgotUser>): Promise<boolean> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}

export const updateMultipleForgot =async (get: object, set: Partial<forgotUser>): Promise<boolean> => {
    try{
        const update = await model.updateMany(get, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}