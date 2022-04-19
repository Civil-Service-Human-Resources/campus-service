import { Injectable } from '@nestjs/common';
import { CacheClient } from '../../client/cache/cache-client.interface';
import { LearningMaterial } from '../models/LearningMaterial';
import { ClientService } from './client/client.service';
import { CSLCourseMapper } from './csl.mapper';

@Injectable()
export class CslService {
  constructor(
    private readonly clientService: ClientService,
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
}
