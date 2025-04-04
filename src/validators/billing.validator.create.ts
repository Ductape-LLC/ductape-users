import Joi from 'joi';

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().optional().allow('', null),
  city: Joi.string().required(),
  country: Joi.string().required(),
  stateProvince: Joi.string().required(),
  postalZipCode: Joi.string().required(),
});

export default schema;
