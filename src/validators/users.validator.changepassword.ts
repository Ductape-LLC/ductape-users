import joi from 'joi';
import { change_password, otp_login } from '../types/users.type';

const schema = joi.object<Partial<change_password>>({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi
        .string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        }),
    token: joi.string().alphanum().min(6).max(6).required(),
});

export default schema