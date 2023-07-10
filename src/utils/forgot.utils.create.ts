import { ObjectId } from "mongoose";
import { confirmUser as forgotUser } from "../types/confirm.type";
import {model} from "../models/forgot.model";
import { handleError } from "../errors/errors";

export const createForgot = async (user_id: ObjectId): Promise<forgotUser> => {
    try {
        const forgot = await model.create({user_id});
        return forgot;
    } catch (e) {
        throw handleError(e);
    }
};