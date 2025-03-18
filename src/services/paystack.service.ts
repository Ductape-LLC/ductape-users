import { IPaystackRepo, PaystackRepo } from '../repo/paystack.repo';
import { PaystackCustomer } from '../types/paystack.type';
import { UserStatus } from '../events/user.events.types';
import axios from 'axios';
import { IUsersRepo, UsersRepo } from '../repo/users.repo';
import { use } from 'node_modules/@types/passport';

export interface IPaystackService {
  createCustomer(data: Partial<PaystackCustomer>): Promise<PaystackCustomer>;
  getCustomerByUserId(userId: string): Promise<PaystackCustomer>;
  deleteCustomer(userId: string): Promise<boolean>;
}

export default class PaystackService implements IPaystackService {
  private paystackRepo: IPaystackRepo;
  private usersRepo: IUsersRepo

  constructor() {
    this.paystackRepo = PaystackRepo;
    this.usersRepo = UsersRepo
  }

  async createCustomer(data: PaystackCustomer): Promise<PaystackCustomer> {
    const { user_id  } = data;

    const user = await this.usersRepo.fetchById(user_id.toString())
    if (!user) throw 'User not Found' 

    const existingCustomer = await this.paystackRepo.findByUserId(user_id.toString());
    if (existingCustomer) {
      throw 'Customer already exists for this user';
    }

    return await this.paystackRepo.create({
      ...data,
      status: UserStatus.ACTIVE
    });
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
}