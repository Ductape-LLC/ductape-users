import mongoose from 'mongoose';

export interface BillingInformation {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  stateProvince: string;
  postalZipCode: string;
}

export interface PaystackAuthorization {
    authorization_code: string;
    card_type: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    bin: string;
    bank: string;
    channel: string;
    signature: string;
    reusable: boolean;
    country_code: string;
  }

export interface PaystackCustomer {
  _id: string;
  save(): unknown;
  user_id: mongoose.Types.ObjectId;
  customer_code: string;
  email: string;
  authorization: PaystackAuthorization;
  status: string;
  domain: string;
  metadata: Record<string, any>;
  billingInformation: BillingInformation;
}
