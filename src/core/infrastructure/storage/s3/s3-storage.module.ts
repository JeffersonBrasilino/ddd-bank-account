import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Config } from './aws-s3.config';
import { AwsS3StorageService } from './aws-s3-storage.service';

@Module({
  imports: [ConfigModule.forFeature(AwsS3Config())],
  providers: [
    {
      provide: 'S3StorageInterface',
      useClass: AwsS3StorageService,
    },
  ],
  exports: ['S3StorageInterface'],
})
export class S3StorageModule {}
