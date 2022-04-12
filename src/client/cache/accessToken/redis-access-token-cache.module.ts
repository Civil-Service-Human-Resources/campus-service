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
        port: 6380,
        auth_pass: configService.get<string>('REDIS_ACCESS_TOKEN_PASS'),
        host: configService.get<string>('REDIS_ACCESS_TOKEN_HOST'),
        tls: {
          host: configService.get<string>('REDIS_ACCESS_TOKEN_HOST'),
        },
      }),
    }),
  ],
  providers: [RedisAccessTokenService],
  exports: [RedisAccessTokenService],
})
export class RedisAccessTokenModule {}
