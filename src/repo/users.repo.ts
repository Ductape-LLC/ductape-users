import { cleanUserData, fetchUser, fetchUserById, generatePublicKey, fetchTemporaryUser } from "../utils/users.utils.read";
import { AuthKeyLoginPayload, users } from "../types/users.type"
import { createUsers, createTemporayUsers } from "../utils/users.utils.create";
import { updateUser, updateMultipleUsers, updateTemporayUsers } from "../utils/users.utils.update";
import { comparePasswords, sha256 } from "../utils/users.utils.string";
import mongoose, { ObjectId } from "mongoose";
import { ActionNotAllow, handleError, UserError } from "../errors/errors";
import { UserStatus } from "../events/user.events.types";

export interface IUsersRepo {
    create(payload: users): Promise<users>;
    createTemporaryUser(payload: Partial<users>): Promise<users>;
    updateTemporaryUser(id: unknown, payload: Partial<users>): Promise<users>;
    login(payload: Partial<users>): Promise<users>;
    updateOne(id: unknown, set: Partial<users>): Promise<boolean>;
    updateMany(get: unknown, set: Partial<users>): Promise<boolean>;
    fetchById(get: unknown): Promise<users>;
    fetchByEmail(email: string): Promise<users>;
    fetchTempUser(payload: users): Promise<users>;
    getTemporaryUser(email: string): Promise<users>;
    fetchByIdReturnPrivateKey(id: ObjectId): Promise<users>;
    fetchByPrivateKey(payload: AuthKeyLoginPayload): Promise<users>;
}

export const UsersRepo: IUsersRepo = {
    async create(payload: users): Promise<users> {
        try {
            return await createUsers(payload);
        } catch (e) {
            throw handleError(e);
        }
    },

    async createTemporaryUser(payload: Partial<users>): Promise<users> {
        try {
            return await createTemporayUsers(payload);
        } catch (e) {
            throw handleError(e);
        }
    },

    async updateTemporaryUser(id: any, payload: Partial<users>): Promise<users> {
        try {
            return await updateTemporayUsers(id, payload);
        } catch (e) {
            throw handleError(e);
        }
    },



    async fetchByPrivateKey(payload: AuthKeyLoginPayload): Promise<users> {
        try {
            const { private_key, workspace_id, user_id } = payload;
            const userData = await fetchUser([{
                $match: {
                    _id: new mongoose.Types.ObjectId(String(user_id)),
                    private_key,
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
                $unwind: {
                    path: "$workspaces", // Unwind the array created by $lookup
                    preserveNullAndEmptyArrays: true,
                }
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
                $unwind: {
                    path: "$workspaceInfo", // Unwind the array created by $lookup
                    preserveNullAndEmptyArrays: true
                }
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
                    firstname: { $first: "$firstname" },
                    lastname: { $first: "$lastname" },
                    email: { $first: "$email" },
                    password: { $first: "$password" },
                    active: { $first: "$active" },
                    created: { $first: "$created" },
                    __v: { $first: "$__v" },
                    private_key: { $first: "$private_key" },
                    workspaces: { $push: "$workspaces" }

                }
            }], "login");

            // const { private_key } = userData;
            const user = cleanUserData(userData);

            let validWorkspace = false;

            user.workspaces?.map((data) => {
                console.log(workspace_id, data.workspace_id);
                if (String(data.workspace_id) === workspace_id) validWorkspace = true;
            })


            if (!validWorkspace) throw new ActionNotAllow()

            return { ...user }

        } catch (e) {
            console.log(e);
            throw handleError(e)
        }
    },
    async login(payload: Partial<users>): Promise<users> {
        try {
            const { email, password: raw, oauth_service } = payload;
            if (!email || (!raw && !oauth_service)) {
                throw new UserError("Email and password are required", 400);
            }
            let match: { email: string | undefined, password?: string } = { email };
            const userData = await fetchUser([{
                $match: match
            }, {
                $lookup: {
                    from: "workspace_accesses",
                    foreignField: "user_id",
                    localField: "_id",
                    as: "workspaces"
                }
            },
            {
                $unwind: {
                    path: "$workspaces", // Unwind the array created by $lookup
                    preserveNullAndEmptyArrays: true,
                }
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
                $unwind: {
                    path: "$workspaceInfo", // Unwind the array created by $lookup
                    preserveNullAndEmptyArrays: true
                }
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
                    firstname: { $first: "$firstname" },
                    lastname: { $first: "$lastname" },
                    email: { $first: "$email" },
                    password: { $first: "$password" },
                    otp: { $first: "$otp" },
                    active: { $first: "$active" },
                    created: { $first: "$created" },
                    __v: { $first: "$__v" },
                    private_key: { $first: "$private_key" },
                    workspaces: { $push: "$workspaces" }

                }
            }], "login");

            if (!userData) {
                throw new UserError("Invalid email or password.", 401);
            }

            console.log("SAAARRRRRYYYYY!!!!", JSON.stringify(userData));

            if (!oauth_service) {
                const isPasswordMatch = await comparePasswords(raw as string, userData.password as string);
                if (!isPasswordMatch) {
                    throw new UserError("Invalid email or password.", 401);
                }
            }

            const { private_key } = userData;
            const user = cleanUserData(userData);
            delete user.password;
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

        const userData = await fetchUser([{ $match: { email } }]);
        const user = cleanUserData(userData);
        return user;
    },
    async fetchTempUser(payload: users): Promise<users> {

        const user = await fetchTemporaryUser([{ $match: { ...payload } }]);
        return user;
    },
    async getTemporaryUser(email: string): Promise<users> {

        const user = await fetchTemporaryUser([{ $match: { email } }]);
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
            const { private_key } = userData;
            if (process.env.NODE_ENV !== "production") console.log("PEEEKEY", private_key, userData);
            return { ...userData, public_key: generatePublicKey(private_key as string), private_key }
        } catch (e) {
            throw handleError(e);
        }
    }
}