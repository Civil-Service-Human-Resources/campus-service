import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisAccessTokenClientConfig {
  readonly redisUrl: string;

  constructor(private configService: ConfigService) {
    this.redisUrl = this.configService.get<string>('REDIS_ACCESS_TOKEN_URL');
  }
}
