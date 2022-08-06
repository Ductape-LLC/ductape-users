import { PipelineStage } from "mongoose";
import { model } from "../models/forgot.model";
import { confirmUser as forgotUser } from "../types/confirm.type";

export const fetchForgot = async (get: PipelineStage[]): Promise<forgotUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw "Forgot credentials not found";

        return data[0];
    } catch(e){
        throw e;
    }
}