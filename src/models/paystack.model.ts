import mongoose from 'mongoose';
import { UserStatus } from '../events/user.events.types';
import { PaystackCustomer } from '../types/paystack.type';

const schema = new mongoose.Schema<PaystackCustomer>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    customer_code: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: false,
    },
    authorization: {
      authorization_code: String,
      card_type: String,
      last4: String,
      exp_month: String,
      exp_year: String,
      bin: String,
      bank: String,
      channel: String,
      signature: String,
      reusable: Boolean,
      country_code: String,
    },
    status: {
      type: String,
      enum: UserStatus,
      required: false,
      default: UserStatus.ACTIVE,
    },
    domain: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    billingInformation: {
      firstName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: false,
      },
      addressLine1: {
        type: String,
        required: false,
      },
      addressLine2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      stateProvince: {
        type: String,
        required: false,
      },
      postalZipCode: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true },
);

export const PaystackCustomerModel = mongoose.model('paystack_customer', schema);
