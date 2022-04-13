import { Module } from '@nestjs/common';
import { CslService } from './csl.service';
import { CslController } from './csl.controller';
import { ClientService } from './client/client.service';
import { HttpClientService } from './http-client/http-client.service';
import { CSLConfig } from './csl.config';
import { CslHealth } from './csl.health';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { CslCacheModule } from './cache/csl.cache.module';
import { CSLContentService } from './content-mapping/content.service';
import { AppInsightsLoggerModule } from '../../util/logging/appi-logger.module';
import { BlobStorageModule } from '../../client/blob-storage/blob-storage.module';
import { RedisAccessTokenModule } from '../../client/cache/accessToken/redis-access-token-cache.module';
import { CSLCourseMapper } from './csl.mapper';

@Module({
  imports: [
    AppInsightsLoggerModule,
    RedisAccessTokenModule,
    HttpModule,
    BlobStorageModule,
    CslCacheModule,
  ],
  providers: [
    CslService,
    ClientService,
    HttpClientService,
    CSLConfig,
    HttpHealthIndicator,
    CSLContentService,
    CslHealth,
    CSLCourseMapper,
  ],
  controllers: [CslController],
  exports: [CslHealth, CSLContentService],
})
export class CslModule {}
