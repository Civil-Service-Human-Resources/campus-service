import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisAccessTokenService } from './redis-access-token-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_ACCESS_TOKEN_HOST'),
        port: configService.get('REDIS_ACCESS_TOKEN_PORT'),
      }),
    }),
  ],
  providers: [RedisAccessTokenService],
  exports: [RedisAccessTokenService],
})
export class RedisAccessTokenModule {}
