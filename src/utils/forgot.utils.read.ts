import { PipelineStage } from "mongoose";
import { model } from "../models/forgot.model";
import { confirmUser as forgotUser } from "../types/confirm.type";
import { UserError, handleError } from "../errors/errors";

export const fetchForgot = async (get: PipelineStage[]): Promise<forgotUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw new UserError("Forgot credentials not found", 400);

        return data[0];
    } catch(e){
        throw handleError(e);
    }
}