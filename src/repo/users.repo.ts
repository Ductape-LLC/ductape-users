import { cleanUserData, fetchUser, fetchUserById, generatePublicKey } from "../utils/users.utils.read";
import { users } from "../types/users.type"
import { createUsers } from "../utils/users.utils.create";
import { updateUser, updateMultipleUsers } from "../utils/users.utils.update";
import { sha256 } from "../utils/users.utils.string";
import mongoose, { ObjectId } from "mongoose";
import { handleError } from "../errors/errors";

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
            throw handleError(e);
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
            },
            {
              $unwind: "$workspaces" // Unwind the array created by $lookup
            },
            {
              $lookup: {
                from: "workspaces", // Assuming this is the name of the collection
                localField: "workspaces.workspace_id",
                foreignField: "_id",
                as: "workspaceInfo"
              }
            },
            {
              $unwind: "$workspaceInfo" // Unwind the array created by $lookup
            },
            {
              $addFields: {
                "workspaces.workspace_name": "$workspaceInfo.name",
                "workspaces.defaultEnvs": "$workspaceInfo.defaultEnvs"
              }
            },
            {
              $group: {
                _id: "$_id",
                firstname: { $first: "$firstname"},
                lastname: { $first: "$lastname"},
                email: { $first: "$email"},
                password: { $first: "$password"},
                active: { $first: "$active"},
                created: { $first: "$created"},
                __v: { $first: "$__v"},
                private_key: { $first: "$private_key"},
                workspaces: { $push: "$workspaces" }

              }
            }]);

            console.log("SAAARRRRRYYYYY!!!!", JSON.stringify(userData));

            const { private_key } = userData;
            const user = cleanUserData(userData);
            user.password = password;

            return { ...user, private_key }

        } catch (e) {
            console.log(e);
            throw handleError(e)
        }
    },
    async updateOne(id: any, set: Partial<users>): Promise<boolean> {
        try {
            return await updateUser(id, set);
        } catch (e) {
            throw handleError(e);
        }
    },
    async updateMany(get: any, set: Partial<users>): Promise<boolean> {
        try {
            return await updateMultipleUsers(get, set);
        } catch (e) {
            throw handleError(e);
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
            throw handleError(e);
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
            if(process.env.NODE_ENV !== "production") console.log("PEEEKEY", private_key, userData);
            return {...userData, public_key: generatePublicKey(private_key as string), private_key}
        } catch (e) {
            throw handleError(e);
        }
    }
}