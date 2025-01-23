import joi from 'joi';
import { users } from '../types/users.type';

const schema = joi.object<users>({
    firstname: joi.string().alphanum().min(2).max(50).required(),
    lastname: joi.string().alphanum().min(2).max(50).required(),
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi
    .string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
        "string.pattern.base": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
    bio: joi.string(),
    private_key: joi.string(),
    active: joi.string()
});

export default schema