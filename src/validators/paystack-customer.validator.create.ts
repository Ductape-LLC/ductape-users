import Joi from 'joi';
import { PaystackCustomer } from '../types/paystack.type';

export const schema = Joi.object<PaystackCustomer>({
    user_id: Joi.string().alphanum().min(24).max(24).required(),
    customer_code: Joi.string().required(),
    email: Joi.string().email().required(),
    authorization: Joi.object().required(),
    domain: Joi.string().required(),
    metadata: Joi.object().optional()
});

export default schema