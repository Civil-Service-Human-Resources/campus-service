import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CSLConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly identityUrl: string;
  readonly accessTokenId: string;
  readonly baseUrl: string;
  readonly csvFileName: string;
  readonly frontendUrl: string;
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
    this.csvFileName = this.configService.get<string>(
      'CSL_CONTENT_CSV_FILENAME',
    );
    this.frontendUrl = this.configService.get<string>(
      'CSL_LEARNING_FRONTEND_URL',
    );
  }
}
