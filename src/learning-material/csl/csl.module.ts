import { CacheModule, Module } from '@nestjs/common';
import { CslService } from './csl.service';
import { CslController } from './csl.controller';
import { ClientService } from './client/client.service';
import { HttpClientService } from './http-client/http-client.service';
import { CSLConfig } from './csl.config';
import { RedisAccessTokenModule } from 'src/client/cache/accessToken/redis-access-token-cache.module';
import { AppInsightsLoggerModule } from 'src/util/logging/appi-logger.module';
import { CslHealth } from './csl.health';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { BlobStorageModule } from 'src/client/blob-storage/blob-storage.module';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AppInsightsLoggerModule,
    RedisAccessTokenModule,
    HttpModule,
    BlobStorageModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [CSLConfig],
      useFactory: async (configService: CSLConfig) => ({
        store: redisStore,
        url: configService.contentCacheUrl,
      }),
    }),
  ],
  providers: [
    CslService,
    ClientService,
    HttpClientService,
    CSLConfig,
    HttpHealthIndicator,
    CslHealth,
  ],
  controllers: [CslController],
  exports: [CslHealth],
})
export class CslModule {}
