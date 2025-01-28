import joi from 'joi';
import { users } from '../types/users.type';

const schema = joi.object<users>({
    firstname: joi.string().alphanum().min(2).max(50).optional(),
    lastname: joi.string().alphanum().min(2).max(50).optional(),
    profilePicture: joi.string().optional(),
    bio: joi.string().optional(),
    otp: joi.object().optional(),
});

export default schema