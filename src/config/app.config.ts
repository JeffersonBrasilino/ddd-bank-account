import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appConfig = () =>
  registerAs('app', () => {
    const values = {
      env: process.env.NODE_ENV,
      version: process.env.API_VERSION,
      port: parseInt(process.env.API_PORT),
      baseUrl: process.env.API_BASE_URL,
      docsUri: process.env.API_DOCS_URI,
      apiAuthTokenSalt: process.env.API_AUTH_TOKEN_SALT,
      apiAuthTokenExpiration: process.env.API_AUTH_TOKEN_EXPIRATION,
      apiAuthRefreshTokenSalt: process.env.API_AUTH_REFRESH_TOKEN_SALT,
      apiAuthRefreshTokenExpiration:
        process.env.API_AUTH_REFRESH_TOKEN_EXPIRATION,
    };
    const schema = Joi.object({
      env: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .required(),
      version: Joi.string().required(),
      port: Joi.number().required(),
      baseUrl: Joi.string().required(),
      docsUri: Joi.string().required(),
      apiAuthTokenSalt: Joi.string().required(),
      apiAuthTokenExpiration: Joi.string().required(),
      apiAuthRefreshTokenExpiration: Joi.string().required(),
      apiAuthRefreshTokenSalt: Joi.string().required(),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }
    return values;
  });
