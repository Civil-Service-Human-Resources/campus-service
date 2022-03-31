import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object({
  APPLICATIONINSIGHTS_CONNECTION_STRING: Joi.string(),
  APPLICATIONINSIGHTS_ROLE_NAME: Joi.string(),
  CSL_LEARNING_CATALOGUE_CLIENT_ID: Joi.string().required(),
  CSL_LEARNING_CATALOGUE_CLIENT_SECRET: Joi.string().required(),
  CSL_LEARNING_CATALOGUE_IDENTITY_URL: Joi.string().uri().required(),
  CSL_LEARNING_CATALOGUE_ACCESS_TOKEN_ID: Joi.string().default('csl'),
  CSL_LEARNING_CATALOGUE_BASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string().allow('development', 'production').required(),
});
