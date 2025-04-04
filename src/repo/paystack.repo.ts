import { deleteOne } from '../utils/paystack.utils.delete';
import { handleError } from '../errors/errors';
import { PaystackCustomer } from '../types/paystack.type';
import { create } from '../utils/paystack.utils.create';
import { updateUser } from '../utils/paystack.utils.update';
import { findOne, find } from '../utils/paystack.utils.read';

export interface IPaystackRepo {
  create(payload: Partial<PaystackCustomer>): Promise<PaystackCustomer>;
  findByUserId(userId: string): Promise<PaystackCustomer | null>;
  findByCustomerCode(code: string): Promise<PaystackCustomer>;
  findByEmail(email: string): Promise<PaystackCustomer>;
  deleteCustomer(userId: string): Promise<boolean>;
  update(id: string, payload: Partial<PaystackCustomer>): Promise<PaystackCustomer>;
}

export const PaystackRepo: IPaystackRepo = {
  async create(payload: Partial<PaystackCustomer>): Promise<PaystackCustomer> {
    try {
      return await create(payload);
    } catch (e) {
      throw handleError(e);
    }
  },

  async update(id: string, payload: Partial<PaystackCustomer>): Promise<PaystackCustomer> {
    try {
      const update = await findOne({ _id: id });
      if (!update) {
        throw 'Paystack customer not found';
      }
      return await updateUser(id, payload);
    }
    catch (e) {
      throw handleError(e);
    }
  },

  async findByUserId(userId: string): Promise<PaystackCustomer | null> {
    try {
      const customer = await findOne({ user_id: userId });
      return customer;
    } catch (e) {
      throw handleError(e);
    }
  },

  async findByCustomerCode(code: string): Promise<PaystackCustomer> {
    try {
      const customer = await findOne({ customer_code: code });
      if (!customer) {
        throw 'Paystack customer not found with this customer code';
      }
      return customer;
    } catch (e) {
      throw handleError(e);
    }
  },

  async findByEmail(email: string): Promise<PaystackCustomer> {
    try {
      const customer = await findOne({ email });
      if (!customer) {
        throw 'Paystack customer not found with this email';
      }
      return customer;
    } catch (e) {
      throw handleError(e);
    }
  },

  async deleteCustomer(userId: string): Promise<boolean> {
    try {
      const customer = await findOne({ user_id: userId });
      if (!customer) {
        throw 'Paystack customer not found';
      }
      return await deleteOne({ user_id: userId });
    } catch (e) {
      throw handleError(e);
    }
  },
};
