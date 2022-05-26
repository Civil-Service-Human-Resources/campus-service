import { Injectable } from '@nestjs/common';
import { AppInsightsLogger } from '../../util/logging/appi-logger';

import { BlobStorageConnectionFactory } from './blob-storage-connection-factory.service';
import { BlobStorageConfig } from './blob-storage.config';

@Injectable()
export class BlobStorageService {
  private readonly logger = new AppInsightsLogger(BlobStorageService.name);
  constructor(
    private readonly config: BlobStorageConfig,
    private readonly connFactory: BlobStorageConnectionFactory,
  ) {}

  private streamToText = async (readable) => {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  };

  getFile = async (fileName: string) => {
    const client = this.connFactory.createClient(
      this.config.connectionString,
      this.config.containerName,
      fileName,
    );
    const downloadedFile = await client.download();
    const content = await this.streamToText(downloadedFile.readableStreamBody);
    return content;
  };
}
