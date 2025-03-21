import { deleteOne } from '../utils/paystack.delete.delete';
import { handleError } from '../errors/errors';
import { PaystackCustomer } from '../types/paystack.type';
import { create } from '../utils/paystack.utils.create';
import { findOne, find } from '../utils/paystack.utils.read';

export interface IPaystackRepo {
  create(payload: Partial<PaystackCustomer>): Promise<PaystackCustomer>;
  findByUserId(userId: string): Promise<PaystackCustomer | null>;
  findByCustomerCode(code: string): Promise<PaystackCustomer>;
  findByEmail(email: string): Promise<PaystackCustomer>;
  deleteCustomer(userId: string): Promise<boolean>;
}

export const PaystackRepo: IPaystackRepo = {
  async create(payload: Partial<PaystackCustomer>): Promise<PaystackCustomer> {
    try {
      return await create(payload);
    } catch (e) {
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
