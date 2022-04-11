import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisAccessTokenClientConfig } from './redis-access-token-cache.config';
import { RedisAccessTokenService } from './redis-access-token-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [RedisAccessTokenClientConfig],
      useFactory: async (configService: RedisAccessTokenClientConfig) => ({
        store: redisStore,
        url: configService.redisUrl,
      }),
    }),
  ],
  providers: [RedisAccessTokenService],
  exports: [RedisAccessTokenService],
})
export class RedisAccessTokenModule {}
