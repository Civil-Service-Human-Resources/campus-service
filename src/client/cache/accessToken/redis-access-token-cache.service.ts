import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheClient } from '../cache-client.interface';
import { AccessToken } from './access-token.model';

@Injectable()
export class RedisAccessTokenService extends CacheClient<AccessToken> {
  constructor(@Inject(CACHE_MANAGER) readonly tokenStore: Cache) {
    super(tokenStore);
  }

  override async setObject(tokenId: string, token: AccessToken) {
    const stringedToken = await JSON.stringify(token);
    return await this.tokenStore.set(tokenId, stringedToken, {
      ttl: token.expiresIn,
    });
  }
}
