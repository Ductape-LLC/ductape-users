import { ObjectId } from 'mongoose';
import { findOne } from '../utils/access.utils.read';
import { handleError } from '../errors/errors';
import { access } from '../types/access.type';

export interface IAccessRepo {
  findOne(get: Partial<access>): Promise<access>;
}

export const AcccessRepo: IAccessRepo = {
  async findOne(get: Partial<access>): Promise<access> {
    try {
      return await findOne(get);
    } catch (e) {
      throw handleError(e);
    }
  },
};
