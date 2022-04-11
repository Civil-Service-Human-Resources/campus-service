import { Module } from '@nestjs/common';
import { BlobStorageConnectionFactory } from './blob-storage-connection-factory.service';
import { BlobStorageConfig } from './blob-storage.config';
import { BlobStorageService } from './blob-storage.service';

@Module({
  providers: [
    BlobStorageConfig,
    BlobStorageService,
    BlobStorageConnectionFactory,
  ],
  exports: [BlobStorageService],
})
export class BlobStorageModule {}
