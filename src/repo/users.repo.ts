import { cleanUserData, fetchUser, fetchUserById, generatePublicKey } from "../utils/users.utils.read";
import { users } from "../types/users.type"
import { createUsers } from "../utils/users.utils.create";
import { updateUser, updateMultipleUsers } from "../utils/users.utils.update";
import { sha256 } from "../utils/users.utils.string";
import mongoose, { ObjectId } from "mongoose";

export interface IUsersRepo {
    create(payload: users): Promise<users>;
    login(payload: Partial<users>): Promise<users>;
    updateOne(id: unknown, set: Partial<users>): Promise<boolean>;
    updateMany(get: unknown, set: Partial<users>): Promise<boolean>;
    fetchById(get: unknown): Promise<users>;
    fetchByEmail(email: string): Promise<users>;
    fetchByIdReturnPrivateKey(id: ObjectId): Promise<users>;
}

export const UsersRepo: IUsersRepo = {
    async create(payload: users): Promise<users> {
        try {
            return await createUsers(payload);
        } catch (e) {
            throw e;
        }
    },
    async login(payload: Partial<users>): Promise<users> {
        try {
            const { email, password: raw } = payload
            const password = sha256(raw as string);
            const userData = await fetchUser([{
                $match: {
                    email,
                    password
                }
            }, {
                $lookup: {
                    from: "workspace_accesses",
                    foreignField: "user_id",
                    localField: "_id",
                    as: "workspaces"
                }
            }]);

            const { private_key } = userData;
            const user = cleanUserData(userData);
            user.password = password;

            return { ...user, private_key }

        } catch (e) {
            throw e
        }
    },
    async updateOne(id: any, set: Partial<users>): Promise<boolean> {
        try {
            return await updateUser(id, set);
        } catch (e) {
            throw e;
        }
    },
    async updateMany(get: any, set: Partial<users>): Promise<boolean> {
        try {
            return await updateMultipleUsers(get, set);
        } catch (e) {
            throw e;
        }
    },
    async fetchByEmail(email: string): Promise<users> {

        const userData = await fetchUser([{$match: {email}}]);

        const user = cleanUserData(userData);

        return user;
    },

    async fetchById(id: ObjectId): Promise<users> {
        try {
            const userData = await fetchUser([{
                $match: {
                    _id: new mongoose.Types.ObjectId(String(id))
                }
            }, {
                $lookup: {
                    from: "workspace_accesses",
                    foreignField: "user_id",
                    localField: "_id",
                    as: "workspaces"
                }
            }]);
            return cleanUserData(userData);
        } catch (e) {
            throw e;
        }
    },

    async fetchByIdReturnPrivateKey(id: ObjectId): Promise<users> {
        try {
            const userData = await fetchUser([{
                $match: {
                    _id: new mongoose.Types.ObjectId(String(id))
                }
            }, {
                $lookup: {
                    from: "workspace_accesses",
                    foreignField: "user_id",
                    localField: "_id",
                    as: "workspaces"
                }
            }]);
            const {private_key} = userData;
            console.log("PEEEKEY", private_key, userData);
            return {...userData, public_key: generatePublicKey(private_key as string), private_key}
        } catch (e) {
            throw e;
        }
    }
}