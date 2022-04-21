import { Injectable } from '@nestjs/common';
import { CacheClient } from '../client/cache/cache-client.interface';
import { CslService } from '../learning-material/csl/csl.service';
import { LearningMaterialSearchResult } from './models/LearningmaterialSearchResult';

@Injectable()
export class SearchService {
  constructor(
    private readonly cslService: CslService,
    private readonly cache: CacheClient<LearningMaterialSearchResult>,
  ) {}

  search = async (criteria: string, page: number) => {
    const cacheKey = `search:${criteria}:${page}`;
    return await this.cache.getObjectWithCallback(cacheKey, async () => {
      return await this.cslService.searchForCourses(criteria, page);
    });
  };
}
