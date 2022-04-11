import { Injectable } from '@nestjs/common';
import { BlobStorageConnectionFactory } from './blob-storage-connection-factory.service';
import { BlobStorageConfig } from './blob-storage.config';

@Injectable()
export class BlobStorageService {
  constructor(
    private readonly config: BlobStorageConfig,
    private readonly connFactory: BlobStorageConnectionFactory,
  ) {}

  getFile = async (fileName: string) => {
    const client = this.connFactory.createClient(
      this.config.connectionString,
      this.config.containerName,
      fileName,
    );
    const downloadedFile = (await client).download();
    return (await downloadedFile).readableStreamBody;
  };
}
