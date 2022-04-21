import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppInsightsLogger } from '../../util/logging/appi-logger';

@Injectable()
export class CacheClient<T> {
  private readonly logger = new AppInsightsLogger(CacheClient.name);
  constructor(@Inject(CACHE_MANAGER) readonly store: Cache) {}

  async getObjectWithCallback(
    key: string,
    getContentCallback: () => Promise<T>,
  ) {
    let content = await this.getObject(key);
    if (!content) {
      content = await getContentCallback();
      await this.setObject(key, content);
    }
    return content;
  }

  async getObject(key: string): Promise<T> {
    try {
      this.logger.debug(`Getting data from cache with key: ${key}`);
      const value = await this.store.get<string>(key);
      return JSON.parse(value) as T;
    } catch (e) {
      this.logger.error(
        `Couldn't get value with cache key ${key} from cache: ${e}`,
      );
    }
  }
  async setObject(key: string, value: T) {
    const stringedValue = await JSON.stringify(value);
    await this.store.set(key, stringedValue);
  }
}
