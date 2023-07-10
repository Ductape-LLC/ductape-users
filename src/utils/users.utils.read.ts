import { ObjectId, PipelineStage } from "mongoose";
import { model } from "../models/users.model";
import { users } from "../types/users.type";
import crypto from "crypto";
import { NotFoundError, handleError } from "../errors/errors";

export const fetchUser =async (get: PipelineStage[]): Promise<users> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw new NotFoundError("User");

        return data[0]
    } catch(e){
        throw handleError(e);
    }
}

export const fetchUserById = async (id: ObjectId): Promise<users> => {
    try{
        const users = await model.findById(id);

        if(users) return users.toObject();

        throw new NotFoundError("User");
    } catch(e) {
        throw handleError(e);
    }
}

export const cleanUserData = (data: users): users => {
    try{
        const {private_key} = data;
        const public_key = generatePublicKey(private_key as string);
        delete data.private_key;

        return {...data, public_key};
    } catch(e) {
        throw handleError(e);
    }
}

export const generatePublicKey = (private_key: string): string => {
    try{
        return HmacSha1(process.env.ENC_KEY, private_key).toString();
    } catch(e) {
        throw handleError(e);
    }
}

export const HmacSha1 = (key: string | undefined, text: string) => {
    // throw new Error("Function not implemented.");

    console.log("text",text);
    // @ts-ignore
    return crypto.createHmac('sha1', key).update(text).digest('hex')

}
