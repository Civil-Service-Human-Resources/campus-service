import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { CacheClient } from '../../../client/cache/cache-client.interface';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const conf = {
          store: redisStore,
          port: configService.get<string>('REDIS_CONTENT_PORT'),
          auth_pass: configService.get<string>('REDIS_CONTENT_PASS'),
          host: configService.get<string>('REDIS_CONTENT_HOST'),
          ttl: 86400,
        };
        if (configService.get<string>('NODE_ENV') == 'production') {
          conf['tls'] = {
            host: configService.get<string>('REDIS_CONTENT_HOST'),
          };
        }
        return conf;
      },
    }),
  ],
  providers: [CacheClient],
  exports: [CacheClient],
})
export class CslCacheModule {}
