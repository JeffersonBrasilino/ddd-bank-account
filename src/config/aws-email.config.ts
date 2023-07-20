import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const AwsEmailConfig = () =>
  registerAs('aws-ses', () => {
    const values = {
      awsSesKey: process.env.AWS_SES_KEY,
      awsSesToken: process.env.AWS_SES_TOKEN,
      awsSesRegion: process.env.AWS_SES_REGION,
      awsSesDefaultEmail: process.env.DEFAULT_EMAIL_ADDRESS,
    };
    const schema = Joi.object({
      awsSesKey: Joi.string().required(),
      awsSesToken: Joi.string().required(),
      awsSesRegion: Joi.string().required(),
      awsSesDefaultEmail: Joi.string().required(),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }
    return values;
  });
