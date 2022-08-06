import { createForgot } from "../utils/forgot.utils.create";
import { confirmUser as forgotUser } from "../types/confirm.type";
import { users } from "../types/users.type";
import { ObjectId } from "mongoose";
import { fetchForgot } from "../utils/forgot.utils.read";

export interface IForgotRepo {
    create(user: users): Promise<forgotUser>;
    fetch(get: Partial<forgotUser>): Promise<forgotUser>;
};

export const ForgotRepo: IForgotRepo = {
    async create(user: users): Promise<forgotUser> {
        const { _id: user_id } = user;

        return await createForgot(user_id as ObjectId);
    },

    async fetch(get: Partial<forgotUser>): Promise<forgotUser> {

        try{
            const {token, _id: forgot_id} = get;
            const _id = forgot_id as ObjectId;

            return await fetchForgot([{
                $match: {
                    token,
                    _id
                }
            }]);
        } catch (e) {
            throw e;
        }
    }
}