import joi from 'joi';
import { users } from '../types/users.type';

const schema = joi.object<Partial<users>>({
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export default schema