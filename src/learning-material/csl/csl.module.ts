import { Module } from '@nestjs/common';
import { CslService } from './csl.service';
import { CslController } from './csl.controller';
import { ClientService } from './client/client.service';
import { HttpClientService } from './http-client/http-client.service';
import { CSLConfig } from './csl.config';
import { RedisAccessTokenModule } from 'src/client/accessToken/redis-access-token-cache.module';
import { AppInsightsLoggerModule } from 'src/util/logging/appi-logger.module';

@Module({
  imports: [AppInsightsLoggerModule, RedisAccessTokenModule],
  providers: [CslService, ClientService, HttpClientService, CSLConfig],
  controllers: [CslController],
})
export class CslModule {}
