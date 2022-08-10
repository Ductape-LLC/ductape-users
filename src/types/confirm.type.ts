import mongoose, { ObjectId } from "mongoose";
import { users } from "./users.type";

export interface confirmUser {
    _id?: ObjectId
    user_id: ObjectId;
    token: string;
    status: boolean;
    created: Date;
    expiry: Date
}

export interface confirmUserEmailEvent { user: users, confirm_id: ObjectId, token: string, auth: string }

export interface forgotUserEmailEvent { user: users, forgot_id: ObjectId, token: string, auth: string }

export interface findUserByEmailAndUpdateIdEvent { email: string, user_id: ObjectId, auth: string }