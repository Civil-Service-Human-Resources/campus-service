import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object({
  APPLICATIONINSIGHTS_CONNECTION_STRING: Joi.string(),
  APPLICATIONINSIGHTS_ROLE_NAME: Joi.string(),
  CSL_LEARNING_CATALOGUE_CLIENT_ID: Joi.string().required(),
  CSL_LEARNING_CATALOGUE_CLIENT_SECRET: Joi.string().required(),
  CSL_LEARNING_CATALOGUE_IDENTITY_URL: Joi.string().uri().required(),
  CSL_LEARNING_CATALOGUE_BASE_URL: Joi.string().uri().required(),
  CSL_LEARNING_CATALOGUE_ACCESS_TOKEN_ID: Joi.string().default('csl-token'),
  CSL_LEARNING_FRONTEND_URL: Joi.string().uri().required(),
  CAMPUS_FRONTEND_URL: Joi.string().uri().required(),
  CSL_CONTENT_CSV_FILENAME: Joi.string().default('course_tagging.csv'),
  BLOB_CONNECTION_STRING: Joi.string().required(),
  BLOB_CONTAINER_NAME: Joi.string().required(),
  REDIS_ACCESS_TOKEN_HOST: Joi.string().required(),
  REDIS_ACCESS_TOKEN_PASS: Joi.string().required().allow(''),
  REDIS_ACCESS_TOKEN_PORT: Joi.number().port().default(6380),
  REDIS_CONTENT_HOST: Joi.string().required(),
  REDIS_CONTENT_PASS: Joi.string().required().allow(''),
  REDIS_CONTENT_PORT: Joi.number().port().default(6380),
  PORT: Joi.number().port().default(3000),
  NODE_ENV: Joi.string().allow('development', 'production').required(),
});
