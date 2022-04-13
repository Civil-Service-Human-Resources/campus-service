import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisAccessTokenService } from './redis-access-token-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const conf = {
          store: redisStore,
          port: configService.get<string>('REDIS_ACCESS_TOKEN_PORT'),
          auth_pass: configService.get<string>('REDIS_ACCESS_TOKEN_PASS'),
          host: configService.get<string>('REDIS_ACCESS_TOKEN_HOST'),
          ttl: 86400,
        };
        if (configService.get<string>('NODE_ENV') == 'production') {
          conf['tls'] = {
            host: configService.get<string>('REDIS_ACCESS_TOKEN_HOST'),
          };
        }
        return conf;
      },
    }),
  ],
  providers: [RedisAccessTokenService],
  exports: [RedisAccessTokenService],
})
export class RedisAccessTokenModule {}
