import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlobStorageConfig {
  readonly connectionString: string;
  readonly containerName: string;

  constructor(private configService: ConfigService) {
    this.connectionString = this.configService.get<string>(
      'BLOB_CONNECTION_STRING',
    );
    this.containerName = this.configService.get<string>('BLOB_CONTAINER_NAME');
  }
}
