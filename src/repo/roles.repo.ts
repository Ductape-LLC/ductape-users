import { ObjectId } from 'mongoose';
import { handleError } from '../errors/errors';
import { IRole } from '../types/permission.type';
import { create } from '../utils/roles.utils.create';
import { findByIdAndUpdate } from '../utils/roles.utils.update';
import { findOne, findById, find } from '../utils/roles.utils.read';
import { remove } from '../utils/roles.utils.delete';

export interface IRolesRepo {
  create(payload: Partial<IRole>): Promise<IRole>;
  updateOne(id: unknown, set: Partial<IRole>): Promise<IRole>;
  fetchById(get: ObjectId): Promise<IRole>;
  findOne(get: unknown): Promise<IRole>;
  find(get: unknown): Promise<Array<IRole>>;
  remove(id: string): Promise<boolean>;
}

export const RolesRepo: IRolesRepo = {
  async create(payload: IRole): Promise<IRole> {
    try {
      return await create(payload);
    } catch (e) {
      throw handleError(e);
    }
  },
  async updateOne(id: any, set: Partial<IRole>): Promise<IRole> {
    try {
      const role = await findOne({ _id: id });
      if (!role) {
        throw 'Role not found';
      }
      return await findByIdAndUpdate(id, set);
    } catch (e) {
      throw handleError(e);
    }
  },
  async fetchById(id: ObjectId): Promise<IRole> {
    try {
      return await findById(id as unknown as string);
    } catch (e) {
      throw handleError(e);
    }
  },
  async findOne(get: any): Promise<IRole> {
    try {
      return await findOne(get);
    } catch (e) {
      throw handleError(e);
    }
  },
  async find(get: any): Promise<Array<IRole>> {
    try {
      return await find(get);
    } catch (e) {
      throw handleError(e);
    }
  },
  async remove(id: string): Promise<boolean> {
    try {
      const role = await findOne({ _id: id });
      if (!role) {
        throw 'Role not found';
      }
      return await remove(id as unknown as ObjectId);
    } catch (e) {
      throw handleError(e);
    }
  },
};
