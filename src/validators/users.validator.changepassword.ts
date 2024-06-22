import joi from 'joi';
import { change_password, otp_login } from '../types/users.type';

const schema = joi.object<Partial<change_password>>({
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi.string().required(),
    token: joi.string().alphanum().min(6).max(6).required(),
});

export default schema