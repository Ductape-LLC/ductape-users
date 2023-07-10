import { PipelineStage } from "mongoose";
import { model } from "../models/otp.model";
import { confirmUser as otpUser } from "../types/confirm.type";
import { handleError } from "../errors/errors";

export const updateOTP =async (id: unknown, set: Partial<otpUser>): Promise<boolean> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}

export const updateMultipleOTP =async (get: object, set: Partial<otpUser>): Promise<boolean> => {
    try{
        const update = await model.updateMany(get, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}