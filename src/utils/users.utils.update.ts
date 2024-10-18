import { PipelineStage } from "mongoose";
import { uuid } from "uuidv4";
import { model } from "../models/users.model";
import { users } from "../types/users.type";
import { handleError, UserError } from "../errors/errors";
import { cleanUserData } from "./users.utils.read";
import { sha256 } from "./users.utils.string";
import { UserStatus } from "../events/user.events.types";

export const updateUser =async (id: unknown, set: Partial<users>): Promise<boolean> => {
    try{
        const update = await model.findByIdAndUpdate(id, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}

export const updateMultipleUsers =async (get: object, set: Partial<users>): Promise<boolean> => {
    try{
        const update = await model.updateMany(get, {$set: {...set}});

        if(update) return true;
        return false;
    } catch(e){
        throw handleError(e);
    }
}

export const updateTemporayUsers = async(id: string, payload: Partial<users>): Promise<users> =>{
    try{

        const { password } = payload;
        payload.password = sha256(password as unknown as string);
        payload.private_key = uuid();
        const create = await model.findByIdAndUpdate(id, {$set: {...payload, status: UserStatus.ACTIVE}});;

        if(create){
            return cleanUserData(create.toObject());
        }
        throw new UserError("User creation failed", 400);
    } catch(e) {
        throw handleError(e);
    }
}