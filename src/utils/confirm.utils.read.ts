import { PipelineStage } from "mongoose";
import { model } from "../models/confirm.model";
import { confirmUser } from "../types/confirm.type";
import { handleError } from "../errors/errors";

export const fetchConfirm = async (get: PipelineStage[]): Promise<confirmUser> => {
    try{
        const data = await model.aggregate(get);

        if(!data.length) throw "Confirm credentials not found";

        return data[0];
    } catch(e){
        throw handleError(e);
    }
}