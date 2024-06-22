import joi from 'joi';
import { AuthKeyLoginPayload, users } from '../types/users.type';

const schema = joi.object<AuthKeyLoginPayload>({
    user_id: joi.string().alphanum().min(24).max(24).required(),
    private_key: joi.string().required(),
    workspace_id: joi.string().required(),
});

export default schema