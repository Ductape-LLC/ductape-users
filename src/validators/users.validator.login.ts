import joi from 'joi';
import { users } from '../types/users.type';

const schema = joi.object<Partial<users>>({
    email: joi.string().email({minDomainSegments: 2}).required(),
    password: joi.string().required(),
});

export default schema