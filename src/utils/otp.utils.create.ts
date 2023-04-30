import { ObjectId } from "mongoose";
import { confirmUser as otpUser } from "../types/confirm.type";
import {model} from "../models/otp.model";

export const createOTP = async (user_id: ObjectId): Promise<otpUser> => {
    try {
        const otp = await model.create({user_id});
        return otp;
    } catch (e) {
        throw e;
    }
};