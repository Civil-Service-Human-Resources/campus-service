import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlobStorageConnectionFactory {
  public createClient(
    connString: string,
    containerName: string,
    fileName: string,
  ) {
    const blobClientService =
      BlobServiceClient.fromConnectionString(connString);
    const containerClient = blobClientService.getContainerClient(containerName);
    return containerClient.getBlobClient(fileName);
  }
}
