import Joi from 'joi';
import mongoose from 'mongoose';

const validateObjectId = (value: string, helpers: any) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().optional().trim(),
    permissions: Joi.array().items(
        Joi.string().custom(validateObjectId, 'validate MongoDB ObjectId')
    ).optional()
});

export default schema;