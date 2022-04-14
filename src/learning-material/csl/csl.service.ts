import { Injectable } from '@nestjs/common';
import { CacheClient } from '../../client/cache/cache-client.interface';
import { LearningMaterial } from '../models/LearningMaterial';
import { CSLClientService } from './client/client.service';
import { CSLCourseMapper } from './csl.mapper';

@Injectable()
export class CslService {
  constructor(
    private readonly clientService: CSLClientService,
    private readonly cache: CacheClient<LearningMaterial>,
    private readonly mapper: CSLCourseMapper,
  ) {}

  async getCourse(courseId: string) {
    const cacheKey = `csl:content:${courseId}`;
    const cachedCourse = await this.cache.getObject(cacheKey);
    if (cachedCourse == null) {
      const course = await this.clientService.getCourseWithId(courseId);
      const convertedCourse = await this.mapper.mapCourseToLearningMaterial(
        course,
      );
      await this.cache.setObject(cacheKey, convertedCourse);
      return convertedCourse;
    } else {
      return cachedCourse;
    }
  }

  async getMultipleCourses(courseIds: string[]) {
    return Promise.all(courseIds.map(async (cId) => await this.getCourse(cId)));
  }

  async searchForCourses(criteria: string, page: number) {
    const res = await this.clientService.searchForCourses(criteria, page);
    return await this.mapper.mapSearchResultsToLearningMaterial(res);
  }
}
