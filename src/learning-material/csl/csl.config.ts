import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CSLConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly identityUrl: string;
  readonly accessTokenId: string;
  readonly baseUrl: string;
  readonly cacheTtl: number;
  readonly csvFileName: string;
  readonly contentCacheUrl: string;
  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>(
      'CSL_LEARNING_CATALOGUE_CLIENT_ID',
    );
    this.clientSecret = this.configService.get<string>(
      'CSL_LEARNING_CATALOGUE_CLIENT_SECRET',
    );
    this.identityUrl = this.configService.get<string>(
      'CSL_LEARNING_CATALOGUE_IDENTITY_URL',
    );
    this.accessTokenId = this.configService.get<string>(
      'CSL_LEARNING_CATALOGUE_ACCESS_TOKEN_ID',
    );
    this.baseUrl = this.configService.get<string>(
      'CSL_LEARNING_CATALOGUE_BASE_URL',
    );
    this.cacheTtl = this.configService.get<number>(
      'CSL_LEARNING_CATALOGUE_CACHE_TTL',
    );
    this.csvFileName = this.configService.get<string>(
      'CSL_CONTENT_CSV_FILENAME',
    );
    this.contentCacheUrl = this.configService.get<string>(
      'CSL_CONTENT_CACHE_URL',
    );
  }
}
