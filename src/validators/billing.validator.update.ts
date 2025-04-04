import Joi from 'joi';

const schema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  addressLine1: Joi.string().optional(),
  addressLine2: Joi.string().optional().allow('', null),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  stateProvince: Joi.string().optional(),
  postalZipCode: Joi.string().optional(),
}).min(1);

export default schema;
