import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export function resolvePresignedUrlEndpoint(
  explicit: string | undefined,
  serverEndpoint: string | undefined,
): string | undefined {
  const explicitTrimmed = explicit?.trim();
  if (explicitTrimmed) {
    return explicitTrimmed;
  }
  const endpoint = serverEndpoint?.trim();
  if (!endpoint) {
    return undefined;
  }
  try {
    const url = new URL(endpoint);
    if (url.hostname !== 'localstack') {
      return undefined;
    }
    url.hostname = 'localhost';
    return url.href.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

export const AwsS3Config = () =>
  registerAs('aws-s3', () => {
    const rawEndpoint = process.env.AWS_S3_ENDPOINT;
    const rawPresignedUrlEndpoint = process.env.AWS_S3_PRESIGNED_URL_ENDPOINT;
    const rawPresignedTtl = process.env.AWS_S3_PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS;
    const rawPresignedReadTtl =
      process.env.AWS_S3_PRESIGNED_READ_EXPIRES_IN_SECONDS;
    const values = {
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_TOKEN,
      region: process.env.AWS_S3_REGION,
      bucket: process.env.AWS_S3_BUCKET,
      endpoint: rawEndpoint?.trim() || undefined,
      presignedUrlEndpoint: resolvePresignedUrlEndpoint(
        rawPresignedUrlEndpoint,
        rawEndpoint,
      ),
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
      presignedUploadExpiresInSeconds:
        rawPresignedTtl !== undefined && rawPresignedTtl !== ''
          ? Number.parseInt(rawPresignedTtl, 10)
          : 300,
      presignedReadExpiresInSeconds:
        rawPresignedReadTtl !== undefined && rawPresignedReadTtl !== ''
          ? Number.parseInt(rawPresignedReadTtl, 10)
          : 3600,
    };
    const schema = Joi.object({
      accessKeyId: Joi.string().required(),
      secretAccessKey: Joi.string().required(),
      region: Joi.string().required(),
      bucket: Joi.string().required(),
      endpoint: Joi.string().optional(),
      presignedUrlEndpoint: Joi.string().optional(),
      forcePathStyle: Joi.boolean().optional(),
      presignedUploadExpiresInSeconds: Joi.number().integer().positive().default(300),
      presignedReadExpiresInSeconds: Joi.number().integer().positive().default(3600),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }
    return values;
  });
