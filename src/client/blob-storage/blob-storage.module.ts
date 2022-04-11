import { Module } from '@nestjs/common';
import { BlobStorageConfig } from './blob-storage.config';
import { BlobStorageService } from './blob-storage.service';

@Module({
  providers: [BlobStorageConfig, BlobStorageService, BlobStorageService],
})
export class BlobStorageModule {}
