import { uuid } from "uuidv4";
import { model } from "../models/users.model";
import { users } from "../types/users.type";
import { cleanUserData, HmacSha1 } from "./users.utils.read";
import { hashPassword, sha256 } from "./users.utils.string";
import { handleError, UserError } from "../errors/errors";

export const createUsers = async(payload: users): Promise<users> =>{
    try{

        const { password } = payload;
        payload.password = await hashPassword(password as string);
        payload.private_key = uuid();
        const create = await model.create(payload);

        if(create){
            return cleanUserData(create.toObject());
        }
        throw new UserError("User creation failed", 400);
    } catch(e) {
        
        throw handleError(e);
    }
}

export const createTemporayUsers = async(payload: Partial<users>): Promise<users> =>{
    try{
        const create = await model.create(payload);
        return create
        throw new UserError("User creation failed", 400);
    } catch(e) {
        throw handleError(e);
    }
}