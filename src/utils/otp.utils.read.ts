import { PipelineStage } from "mongoose";
import { model } from "../models/otp.model";
import { confirmUser as otpUser } from "../types/confirm.type";
import { UserError, handleError } from "../errors/errors";

export const fetchOTP = async (get: PipelineStage[]): Promise<otpUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw new UserError("OTP credentials not found", 400);

        return data[0];
    } catch(e){
        throw handleError(e);
    }
}