import { uuid } from "uuidv4";
import { model } from "../models/users.model";
import { users } from "../types/users.type";
import { cleanUserData, HmacSha1 } from "./users.utils.read";
import { sha256 } from "./users.utils.string";
import { handleError } from "../errors/errors";

export const createUsers = async(payload: users): Promise<users> =>{
    try{

        const { password } = payload;
        payload.password = sha256(password);
        payload.private_key = uuid();
        const create = await model.create(payload);

        if(create){
            return cleanUserData(create.toObject());
        }
        throw "User creation failed";
    } catch(e) {
        throw handleError(e);
    }
}