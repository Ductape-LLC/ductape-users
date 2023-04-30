import { createOTP } from "../utils/otp.utils.create";
import { confirmUser as otpUser } from "../types/confirm.type";
import { users } from "../types/users.type";
import mongoose, { ObjectId } from "mongoose";
import { fetchOTP } from "../utils/otp.utils.read";
import { updateOTP } from "../utils/otp.utils.update";

export interface IOTPRepo {
    create(user: users): Promise<otpUser>;
    fetch(get: Partial<otpUser>): Promise<otpUser>;
    fetchByUser(get: Partial<otpUser>): Promise<otpUser>;
    updateOne(id: any, set: Partial<otpUser>): Promise<boolean>;
};

export const OTPRepo: IOTPRepo = {
    async create(user: users): Promise<otpUser> {
        const { _id: user_id } = user;

        return await createOTP(user_id as ObjectId);
    },

    async fetch(get: Partial<otpUser>): Promise<otpUser> {

        try{
            const {token, _id: otp_id} = get;
            const _id = otp_id as ObjectId;

            return await fetchOTP([{
                $match: {
                    token,
                    _id
                }
            }]);
        } catch (e) {
            throw e;
        }
    },

    async fetchByUser(get: Partial<otpUser>): Promise<otpUser> {

        try{
            const {token, user_id} = get;

            return await fetchOTP([{
                $match: {
                    token,
                    user_id: new mongoose.Types.ObjectId(user_id as unknown as string)
                }
            }]);
        } catch (e) {
            throw e;
        }
    },

    async updateOne(id: any, set: Partial<otpUser>): Promise<boolean> {
        try {
            return await updateOTP(id, set);
        } catch (e) {
            throw e;
        }
    },
}