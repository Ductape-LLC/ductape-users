import { IPaystackRepo, PaystackRepo } from '../repo/paystack.repo';
import { BillingInformation, PaystackCustomer } from '../types/paystack.type';
import { UserStatus } from '../events/user.events.types';
import axios from 'axios';
import { IUsersRepo, UsersRepo } from '../repo/users.repo';
import { use } from 'node_modules/@types/passport';
import { Types } from 'mongoose';

export interface IPaystackService {
  createCustomer(data: Partial<PaystackCustomer>): Promise<PaystackCustomer>;
  getCustomerByUserId(userId: string): Promise<PaystackCustomer>;
  deleteCustomer(userId: string): Promise<boolean>;
}

export default class PaystackService implements IPaystackService {
  private paystackRepo: IPaystackRepo;
  private usersRepo: IUsersRepo;

  constructor() {
    this.paystackRepo = PaystackRepo;
    this.usersRepo = UsersRepo;
  }

  async createCustomer(data: Partial<PaystackCustomer>): Promise<PaystackCustomer> {
    const { user_id } = data;

    if (!user_id) throw 'user_id is required';

    const user = await this.usersRepo.fetchById(user_id.toString());
    if (!user) throw 'User not Found';

    const existingCustomer = await this.paystackRepo.findByUserId(user_id.toString());
    if (existingCustomer) {
      return await this.paystackRepo.update(existingCustomer._id, {
        ...data,
        status: UserStatus.ACTIVE,
      });
    } else {
      return await this.paystackRepo.create({
        ...data,
        status: UserStatus.ACTIVE,
      });
    }
  }

  async getCustomerByUserId(userId: string): Promise<PaystackCustomer> {
    const customer = await this.paystackRepo.findByUserId(userId);
    if (!customer) {
      throw 'Customer has no saved card';
    }
    return customer;
  }

  async deleteCustomer(userId: string): Promise<boolean> {
    const customer = await this.paystackRepo.findByUserId(userId);
    if (!customer) {
      throw 'Customer has no saved card';
    }
    return await this.paystackRepo.deleteCustomer(userId);
  }

  async createBillingInfo(billingData: BillingInformation, userId: string) {
    const customer = await this.paystackRepo.findByUserId(userId);

    if (!customer) {
      return await this.createCustomer({ user_id: new Types.ObjectId(userId), billingInformation: billingData });
    }
    const updatedCustomer = await this.paystackRepo.update(customer._id, { billingInformation: billingData });
    return updatedCustomer;
  }

  async fetchBillingInfo(userId: string) {
    const customer = await this.paystackRepo.findByUserId(userId);

    if (!customer) {
      const user = await this.createCustomer({ 
        user_id: new Types.ObjectId(userId), 
        billingInformation: {
          firstName: '',
          lastName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          stateProvince: '',
          country: '',
          postalZipCode: ''
        } 
      });
      return user.billingInformation;
    }

    if (!customer.billingInformation) {
      throw 'No billing information found';
    }

    return customer.billingInformation;
  }
}
