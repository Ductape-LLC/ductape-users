import joi from 'joi';
import { users } from '../types/users.type';
import { UserStatus } from '../events/user.events.types';

const schema = joi.object<users>({
    email: joi.string().email({minDomainSegments: 2}).required(),
    status: joi.string().valid(...Object.values(UserStatus)).required(),
});

export default schema