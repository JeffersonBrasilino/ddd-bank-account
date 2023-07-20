import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const eventSourceConfig = () =>
  registerAs('event-sourcing', () => {
    const values = {
      name: 'teste1',
      publisherUrl: process.env.EVENT_SOURCING_RABBIT_PUBLISHER_URL,
      publisherQueue: process.env.EVENT_SOURCING_RABBIT_PUBLISHER_QUEUE,
      subscriberUrl: process.env.EVENT_SOURCING_RABBIT_SUBSCRIBER_URL,
      subscriberQueue: process.env.EVENT_SOURCING_RABBIT_SUBSCRIBER_QUEUE,
    };
    const schema = Joi.object({
      name: Joi.string().optional(),
      publisherUrl: Joi.string().optional(),
      publisherQueue: Joi.string().optional(),
      subscriberUrl: Joi.string().optional(),
      subscriberQueue: Joi.string().optional(),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }
    return values;
  });
