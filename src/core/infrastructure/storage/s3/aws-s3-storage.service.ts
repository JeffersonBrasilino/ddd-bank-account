import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AbstractError, ErrorFactory } from '@core/domain/errors';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3StorageConfig, S3StorageInterface } from './s3-storage.interface';
import { LoggerDecorator } from '@core/infrastructure/logger';

@Injectable()
export class AwsS3StorageService implements S3StorageInterface {
  private readonly logger = new Logger(AwsS3StorageService.name);
  private s3Client: S3Client;
  private presigningS3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.initializeS3Client();
  }

  private buildS3Client(
    config: S3StorageConfig,
    endpoint?: string,
  ): S3Client {
    const clientConfig: Record<string, unknown> = {
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    };

    if (endpoint) {
      clientConfig.endpoint = endpoint;
    }
    if (config.forcePathStyle) {
      clientConfig.forcePathStyle = config.forcePathStyle;
    }

    return new S3Client(clientConfig as any);
  }

  private initializeS3Client(): void {
    const config = this.configService.get<S3StorageConfig>('aws-s3');

    if (!config) {
      throw new Error('AWS S3 configuration not found');
    }

    this.bucket = config.bucket;

    this.s3Client = this.buildS3Client(config, config.endpoint);

    this.presigningS3Client = config.presignedUrlEndpoint
      ? this.buildS3Client(config, config.presignedUrlEndpoint)
      : this.s3Client;
  }

  @LoggerDecorator()
  async saveFile(
    path: string,
    fileContent: string | Buffer,
    contentType?: string,
  ): Promise<boolean | AbstractError<any>> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: fileContent,
        ContentType: contentType || 'application/octet-stream',
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.logger.error(`S3 saveFile failed [key=${path}]: ${error}`);
      return ErrorFactory.create('Dependency', error.toString());
    }
  }

  @LoggerDecorator()
  async getFile(path: string): Promise<string | AbstractError<any>> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });

      const response: GetObjectCommandOutput =
        await this.s3Client.send(command);

      if (!response.Body) {
        return '';
      }

      const bytes = await response.Body.transformToByteArray();
      return Buffer.from(bytes).toString('binary');
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return '';
      }
      return ErrorFactory.create('Dependency', error.toString());
    }
  }

  @LoggerDecorator()
  async deleteFile(path: string): Promise<boolean | AbstractError<any>> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return ErrorFactory.create('Dependency', error.toString());
    }
  }

  @LoggerDecorator()
  async getTemporaryUrl(
    path: string,
    expirationTimeInSeconds: number,
  ): Promise<string | AbstractError<any>> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });

      const signedUrl = await getSignedUrl(this.presigningS3Client, command, {
        expiresIn: expirationTimeInSeconds,
      });

      return signedUrl;
    } catch (error) {
      return ErrorFactory.create('Dependency', error.toString());
    }
  }

  @LoggerDecorator()
  async getPresignedUploadUrl(
    path: string,
    options?: {
      contentType?: string;
      expiresInSeconds?: number;
    },
  ): Promise<string | AbstractError<any>> {
    try {
      const expiresIn = options?.expiresInSeconds ?? 300;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        ContentType: options?.contentType ?? 'application/octet-stream',
      });

      const signedUrl = await getSignedUrl(this.presigningS3Client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error) {
      return ErrorFactory.create('Dependency', error.toString());
    }
  }
}
