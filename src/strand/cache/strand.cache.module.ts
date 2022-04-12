import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheClient } from '../../client/cache/cache-client.interface';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        port: 6380,
        auth_pass: configService.get<string>('REDIS_CONTENT_PASS'),
        host: configService.get<string>('REDIS_CONTENT_HOST'),
        tls: {
          host: configService.get<string>('REDIS_CONTENT_HOST'),
        },
        ttl: 86400,
      }),
    }),
  ],
  providers: [CacheClient],
  exports: [CacheClient],
})
export class StrandCacheModule {}
