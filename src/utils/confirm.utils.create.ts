import { ObjectId } from "mongoose";
import { confirmUser } from "../types/confirm.type";
import {model} from "../models/confirm.model";

export const createConfirm = async (user_id: ObjectId): Promise<confirmUser> => {
    try {
        const confirm = await model.create({user_id});
        return confirm;
    } catch (e) {
        throw e;
    }
};