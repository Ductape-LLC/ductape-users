import { ObjectId } from 'mongoose';
import { handleError } from '../errors/errors';
import { IPermission } from '../types/permission.type';
import { create } from '../utils/permissions.utils.create';
import { findByIdAndUpdate, findOneAndUpdate } from '../utils/permissions.utils.update';
import { findOne, findById, find } from '../utils/permissions.utils.read';
import { remove } from '../utils/permissions.utils.delete';

export interface IPermissionsRepo {
  create(payload: Partial<IPermission>): Promise<IPermission>;
  findByIdAndUpdate(id: unknown, set: Partial<IPermission>): Promise<IPermission>;
  updateOne(payload: Partial<IPermission>, set: Partial<IPermission>): Promise<IPermission>;
  fetchById(get: ObjectId): Promise<IPermission>;
  findOne(get: unknown): Promise<IPermission>;
  find(get: unknown): Promise<Array<IPermission | any>>;
  remove(id: string): Promise<boolean>;
}

export const PermissionsRepo: IPermissionsRepo = {
  async create(payload: IPermission): Promise<IPermission> {
    try {
      return await create(payload);
    } catch (e) {
      throw handleError(e);
    }
  },
  async updateOne(id: any, set: Partial<IPermission>): Promise<IPermission> {
    try {
      const permission = await findOne({ _id: id });
      if (!permission) {
        throw 'Permission not found';
      }
      return await findOneAndUpdate(id, set);
    } catch (e) {
      throw handleError(e);
    }
  },
  async findByIdAndUpdate(id: any, set: Partial<IPermission>): Promise<IPermission> {
    try {
      return await findByIdAndUpdate(id, set);
    } catch (e) {
      throw handleError(e);
    }
  },
  async fetchById(id: ObjectId): Promise<IPermission> {
    try {
      return await findById(id as unknown as string);
    } catch (e) {
      throw handleError(e);
    }
  },
  async findOne(get: any): Promise<IPermission> {
    try {
      return await findOne(get);
    } catch (e) {
      throw handleError(e);
    }
  },
  async find(get: any): Promise<Array<IPermission | any>> {
    try {
      return await find(get);
    } catch (e) {
      throw handleError(e);
    }
  },
  async remove(id: string): Promise<boolean> {
    try {
      const permission = await findOne({ _id: id });
      if (!permission) {
        throw 'Permission not found';
      }
      return await remove(id as unknown as ObjectId);
    } catch (e) {
      throw handleError(e);
    }
  },
};
