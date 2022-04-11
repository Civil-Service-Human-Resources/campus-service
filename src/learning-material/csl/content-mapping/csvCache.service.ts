import { Injectable } from '@nestjs/common';
import { CacheClient } from 'src/client/cache/cache-client.interface';

import { ContentRow } from '../models/contentMapping.model';

@Injectable()
export class CsvCacheService extends CacheClient<ContentRow[]> {}
