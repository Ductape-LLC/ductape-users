import { PipelineStage } from "mongoose";
import { model } from "../models/confirm.model";
import { confirmUser } from "../types/confirm.type";
import { UserError, handleError } from "../errors/errors";

export const fetchConfirm = async (get: PipelineStage[]): Promise<confirmUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length){
            if(process.env.NODE_ENV === "production") 
                throw new UserError("Confirm credentials not found", 400);
            else {
                return null as unknown as confirmUser;
            }
        }

        return data[0];
    } catch(e){
        throw handleError(e);
    }
}