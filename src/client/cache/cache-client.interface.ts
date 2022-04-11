import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheClient<T> {
  constructor(@Inject(CACHE_MANAGER) readonly tokenStore: Cache) {}

  async getObject(key: string): Promise<T> {
    try {
      const value = await this.tokenStore.get<string>(key);
      return JSON.parse(value) as T;
    } catch (e) {
      console.log(`Couldn't get value from cache: ${e}`);
    }
  }
  async setObject(key: string, value: T) {
    const stringedValue = await JSON.stringify(value);
    await this.tokenStore.set(key, stringedValue);
  }
}
