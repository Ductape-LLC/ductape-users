import { PipelineStage } from "mongoose";
import { model } from "../models/otp.model";
import { confirmUser as otpUser } from "../types/confirm.type";

export const fetchOTP = async (get: PipelineStage[]): Promise<otpUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw "OTP credentials not found";

        return data[0];
    } catch(e){
        throw e;
    }
}