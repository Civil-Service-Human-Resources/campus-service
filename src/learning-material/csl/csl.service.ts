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
    return await this.cache.getObjectWithCallback(cacheKey, async () => {
      const course = await this.clientService.getCourseWithId(courseId);
      return await this.mapper.mapCourseToLearningMaterial(course);
    });
  }

  async getMultipleCourses(courseIds: string[]) {
    const courses = [];
    for (let i = 0; i < courseIds.length; i++) {
      const courseId = courseIds[i];
      const course = await this.getCourse(courseId);
      courses.push(course);
    }
    return courses;
  }

  async searchForCourses(criteria: string, page: number) {
    const res = await this.clientService.searchForCourses(criteria, page);
    return await this.mapper.mapSearchResultsToLearningMaterial(res, page);
  }
}
