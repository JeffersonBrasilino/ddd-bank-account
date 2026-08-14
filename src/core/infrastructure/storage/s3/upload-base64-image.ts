import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { UuIdV7 } from '@core/infrastructure/uuid/uuIdv7';
import { S3StorageInterface } from './s3-storage.interface';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
};

export function isBase64DataUrl(value: string): boolean {
  return typeof value === 'string' && value.startsWith('data:image/');
}

export function parseBase64DataUrl(
  value: string,
): { buffer: Buffer; contentType: string; extension: string } | null {
  const match = value.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;

  const contentType = match[1].toLowerCase();
  const base64Data = match[2];
  const extension = MIME_TO_EXT[contentType];
  if (!extension) return null;

  const buffer = Buffer.from(base64Data, 'base64');
  return { buffer, contentType, extension };
}

export async function uploadBase64ImageToS3(
  s3: S3StorageInterface,
  tenantId: string,
  context: string,
  entityUuid: string,
  fieldName: string,
  base64Value: string,
): Promise<string | AbstractError<any>> {
  const parsed = parseBase64DataUrl(base64Value);
  if (!parsed) {
    return ErrorFactory.create('Validation', [
      { field: fieldName, message: 'Invalid base64 image format. Expected data URL: data:image/<type>;base64,...' },
    ]);
  }

  const { buffer, contentType, extension } = parsed;
  const fileUuid = new UuIdV7().generate();
  const key = `${tenantId}/${context}/${entityUuid}/${fileUuid}_${fieldName}.${extension}`;

  const result = await s3.saveFile(key, buffer, contentType);
  if (result instanceof AbstractError) return result;

  return key;
}
