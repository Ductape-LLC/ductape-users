import joi from 'joi';
import { users } from '../types/users.type';

const schema = joi.object<users>({
    firstname: joi.string().alphanum().min(2).max(50).required(),
    lastname: joi.string().alphanum().min(2).max(50).required(),
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    bio: joi.string(),
    private_key: joi.string(),
    active: joi.string()
});

export default schema