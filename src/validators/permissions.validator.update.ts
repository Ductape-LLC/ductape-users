import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    category: Joi.string().optional().trim(),
    isBasePermission: Joi.boolean().optional()
}).min(1);

export default schema