import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { CacheClient } from '../../../client/cache/cache-client.interface';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_ACCESS_TOKEN_URL'),
        ttl: 86400,
      }),
    }),
  ],
  providers: [CacheClient],
  exports: [CacheClient],
})
export class CslCacheModule {}
