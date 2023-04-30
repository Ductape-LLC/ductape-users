import joi from 'joi';
import { otp_login } from '../types/users.type';

const schema = joi.object<Partial<otp_login>>({
    user_id: joi.string().alphanum().min(24).max(24).required(),
    token: joi.string().alphanum().min(6).max(6).required(),
});

export default schema