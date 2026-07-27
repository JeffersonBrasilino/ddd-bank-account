import { AbstractError } from '@core/domain/errors';
import { S3StorageInterface } from './s3-storage.interface';

export async function resolvePresignedReadUrl(
  storage: S3StorageInterface,
  path: string | undefined,
  expiresInSeconds: number,
): Promise<string | null> {
  if (!path) {
    return null;
  }
  const result = await storage.getTemporaryUrl(path, expiresInSeconds);
  if (result instanceof AbstractError) {
    console.warn(
      `Failed to generate presigned read URL for key "${path}"`,
      result,
    );
    return null;
  }
  return result;
}
