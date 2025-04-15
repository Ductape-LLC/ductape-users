import joi from 'joi';

const schema = joi.object({
    token: joi.string().alphanum().min(6).max(6).required()
});

export default schema