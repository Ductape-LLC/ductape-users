import joi from 'joi';
import { change_password } from '../types/users.type';

const changePasswordSchema = joi.object<Partial<change_password>>({
  oldPassword: joi.string().required(),
  newPassword: joi.string().min(8).max(64).required(),
  confirmNewPassword: joi.string().min(8).max(64).required(),
});

export default changePasswordSchema;
