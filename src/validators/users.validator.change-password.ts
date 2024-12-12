import joi from 'joi';
import { change_password } from '../types/users.type';

const changePasswordSchema = joi.object<Partial<change_password>>({
    oldPassword: joi.string().required(),
    newPassword: joi.string()
        .min(8)
        .max(64)
        .required(),
    confirmNewPassword: joi.string()
        .valid(joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Passwords must match'
        })
});

export default changePasswordSchema;