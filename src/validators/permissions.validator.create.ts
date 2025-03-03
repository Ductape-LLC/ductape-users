import Joi from 'joi';

export const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().optional().trim(),
    category: Joi.string().optional().trim(),
    isBasePermission: Joi.boolean().default(false)
});

export default schema