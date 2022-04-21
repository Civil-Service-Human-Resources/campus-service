import { Injectable } from '@nestjs/common';
import { CacheClient } from '../client/cache/cache-client.interface';
import { CslService } from '../learning-material/csl/csl.service';
import { LearningMaterialSearchResult } from '../learning-material/models/LearningmaterialSearchResult';

@Injectable()
export class SearchService {
  constructor(
    private readonly cslService: CslService,
    private readonly cache: CacheClient<LearningMaterialSearchResult>,
  ) {}

  search = async (criteria: string, page: number) => {
    const cacheKey = `search:${criteria}:${page}`;
    let res = await this.cache.getObject(cacheKey);
    if (!res) {
      // CSL pages start at 0, so - 1 from the value passed in
      res = await this.cslService.searchForCourses(criteria, page - 1);
      this.cache.setObject(cacheKey, res);
    }
    return res;
  };
}
