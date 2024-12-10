import joi from 'joi';
import { change_password } from '../types/users.type';

const changePasswordSchema = joi.object<Partial<change_password>>({
    oldPassword: joi.string().required(),
    newPassword: joi.string()
        .min(8)
        .max(64)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.#])[A-Za-z\\d@$!%*?&.#]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be less than 64 characters long'
        }),
    confirmNewPassword: joi.string()
        .valid(joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Passwords must match'
        })
});

export default changePasswordSchema;