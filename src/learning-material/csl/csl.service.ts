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
      const courses = await this.clientService.getCoursesWithIds([courseId]);
      if (courses.length > 0) {
        return await this.mapper.mapCourseToLearningMaterial(courses[0]);
      } else {
        return undefined;
      }
    });
  }

  async getMultipleCourses(courseIds: string[]) {
    const courses = [];
    const notFoundCourseIds = [];
    for (let i = 0; i < courseIds.length; i++) {
      const courseId = courseIds[i];
      const course = await this.cache.getObject(`csl:content:${courseId}`);
      course ? courses.push(course) : notFoundCourseIds.push(courseId);
    }
    if (notFoundCourseIds.length > 0) {
      const notFoundCourses = await this.clientService.getCoursesWithIds(
        notFoundCourseIds,
      );
      courses.push(...notFoundCourses);
    }
    return courses;
  }

  async searchForCourses(criteria: string, page: number) {
    const res = await this.clientService.searchForCourses(criteria, page);
    return await this.mapper.mapSearchResultsToLearningMaterial(res, page);
  }
}
