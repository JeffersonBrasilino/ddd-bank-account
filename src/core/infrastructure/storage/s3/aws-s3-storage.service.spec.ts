import { ErrorFactory } from '@core/domain/errors';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3StorageService } from './aws-s3-storage.service';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-s3', () => {
  const actual = jest.requireActual('@aws-sdk/client-s3');
  return {
    ...actual,
    S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  };
});
jest.mock('@aws-sdk/s3-request-presigner');

describe('AwsS3StorageService', () => {
  let service: AwsS3StorageService;
  let configService: ConfigService;

  const mockConfig = {
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    region: 'us-east-1',
    bucket: 'test-bucket',
    endpoint: undefined,
    forcePathStyle: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockConfig),
          },
        },
      ],
    }).compile();

    service = module.get<AwsS3StorageService>(AwsS3StorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveFile', () => {
    it('should save file successfully', async () => {
      mockSend.mockResolvedValue({});

      const result = await service.saveFile(
        'test/path.txt',
        'test content',
        'text/plain',
      );

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'test/path.txt',
            Body: 'test content',
            ContentType: 'text/plain',
          },
        }),
      );
    });

    it('should return error when save fails', async () => {
      const error = new Error('S3 error');
      mockSend.mockRejectedValue(error);

      const result = await service.saveFile('test/path.txt', 'test content');

      expect(result).toBeInstanceOf(
        ErrorFactory.create('Dependency', error.toString()).constructor,
      );
    });
  });

  describe('getFile', () => {
    it('should get file successfully', async () => {
      const mockBody = {
        transformToByteArray: jest
          .fn()
          .mockResolvedValue(Buffer.from('file content', 'binary')),
      };
      mockSend.mockResolvedValue({ Body: mockBody });

      const result = await service.getFile('test/path.txt');

      expect(result).toBe('file content');
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'test/path.txt',
          },
        }),
      );
    });

    it('should return empty string when file not found', async () => {
      const error = new Error('NoSuchKey');
      error.name = 'NoSuchKey';
      mockSend.mockRejectedValue(error);

      const result = await service.getFile('test/path.txt');

      expect(result).toBe('');
    });

    it('should return error when get fails', async () => {
      const error = new Error('S3 error');
      mockSend.mockRejectedValue(error);

      const result = await service.getFile('test/path.txt');

      expect(result).toBeInstanceOf(
        ErrorFactory.create('Dependency', error.toString()).constructor,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      mockSend.mockResolvedValue({});

      const result = await service.deleteFile('test/path.txt');

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'test/path.txt',
          },
        }),
      );
    });

    it('should return error when delete fails', async () => {
      const error = new Error('S3 error');
      mockSend.mockRejectedValue(error);

      const result = await service.deleteFile('test/path.txt');

      expect(result).toBeInstanceOf(
        ErrorFactory.create('Dependency', error.toString()).constructor,
      );
    });
  });

  describe('getTemporaryUrl', () => {
    it('should generate temporary url successfully', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue('https://temporary-url.com');

      const result = await service.getTemporaryUrl('test/path.txt', 3600);

      expect(result).toBe('https://temporary-url.com');
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'test/path.txt',
          },
        }),
        { expiresIn: 3600 },
      );
    });

    it('should return error when url generation fails', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      const error = new Error('URL generation error');
      getSignedUrl.mockRejectedValue(error);

      const result = await service.getTemporaryUrl('test/path.txt', 3600);

      expect(result).toBeInstanceOf(
        ErrorFactory.create('Dependency', error.toString()).constructor,
      );
    });

  });

  describe('getPresignedUploadUrl', () => {
    it('should generate presigned upload url successfully', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue('https://upload-url.com');

      const result = await service.getPresignedUploadUrl('upload/key.png', {
        contentType: 'image/png',
        expiresInSeconds: 120,
      });

      expect(result).toBe('https://upload-url.com');
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: {
            Bucket: 'test-bucket',
            Key: 'upload/key.png',
            ContentType: 'image/png',
          },
        }),
        { expiresIn: 120 },
      );
    });

    it('should use default expiresIn and contentType when omitted', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue('https://upload-url.com');

      await service.getPresignedUploadUrl('upload/key.bin');

      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          input: expect.objectContaining({
            ContentType: 'application/octet-stream',
          }),
        }),
        { expiresIn: 300 },
      );
    });

    it('should return error when presigned upload url generation fails', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      const error = new Error('Presign error');
      getSignedUrl.mockRejectedValue(error);

      const result = await service.getPresignedUploadUrl('k', {
        contentType: 'image/png',
      });

      expect(result).toBeInstanceOf(
        ErrorFactory.create('Dependency', error.toString()).constructor,
      );
    });
  });

  describe('configuration', () => {
    it('should throw error when config is not found', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);

      expect(() => new AwsS3StorageService(configService)).toThrow(
        'AWS S3 configuration not found',
      );
    });

    it('should configure with custom endpoint', () => {
      const customConfig = {
        ...mockConfig,
        endpoint: 'http://localhost:4566',
        forcePathStyle: true,
      };

      jest.spyOn(configService, 'get').mockReturnValue(customConfig);

      expect(() => new AwsS3StorageService(configService)).not.toThrow();
    });

    it('should configure with custom endpoint', () => {
      const customEndpointConfig = {
        ...mockConfig,
        endpoint: 'https://account-id.r2.cloudflarestorage.com',
        region: 'auto',
      };

      jest.spyOn(configService, 'get').mockReturnValue(customEndpointConfig);

      expect(() => new AwsS3StorageService(configService)).not.toThrow();
    });

    it('should configure for standard AWS S3 without endpoint or forcePathStyle', () => {
      const s3Config = { ...mockConfig, endpoint: undefined, forcePathStyle: false };

      jest.spyOn(configService, 'get').mockReturnValue(s3Config);

      expect(() => new AwsS3StorageService(configService)).not.toThrow();
    });

    it('should apply forcePathStyle from config independently of endpoint', () => {
      const localstackConfig = {
        ...mockConfig,
        endpoint: 'http://localstack:4566',
        forcePathStyle: true,
      };

      jest.spyOn(configService, 'get').mockReturnValue(localstackConfig);

      expect(() => new AwsS3StorageService(configService)).not.toThrow();
    });
  });
});
