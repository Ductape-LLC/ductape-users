import { model } from '../models/roles.model';
import { ObjectId } from 'mongoose';

export const remove = async (id: ObjectId): Promise<boolean> => {
    try {
        const remove = await model.findByIdAndDelete(id);
        if (remove) return true;
        return false;
    } catch (e) {
        throw e;
    }
}