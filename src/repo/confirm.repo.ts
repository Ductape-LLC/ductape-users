import { createConfirm } from "../utils/confirm.utils.create";
import { confirmUser } from "../types/confirm.type";
import { users } from "../types/users.type";
import { ObjectId } from "mongoose";
import { fetchConfirm } from "../utils/confirm.utils.read";

export interface IConfirmRepo {
    create(user: users): Promise<confirmUser>;
    fetch(get: Partial<confirmUser>): Promise<confirmUser>;
};

export const ConfirmRepo: IConfirmRepo = {
    async create(user: users): Promise<confirmUser> {
        const { _id: user_id } = user;

        return await createConfirm(user_id as ObjectId);
    },

    async fetch(get: Partial<confirmUser>): Promise<confirmUser> {

        try{
            const {token, _id: confirm_id} = get;
            const _id = confirm_id as ObjectId;

            return await fetchConfirm([{
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