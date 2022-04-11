import { Injectable } from '@nestjs/common';
import { LearningMaterial } from '../models/LearningMaterial';
import { ClientService } from './client/client.service';
import { Course } from './models/output/course.model';
import { CacheClient } from 'src/client/cache/cache-client.interface';

@Injectable()
export class CslService {
  constructor(
    private readonly clientService: ClientService,
    private readonly cache: CacheClient<LearningMaterial>,
  ) {}

  async getCourse(courseId: string) {
    const cacheKey = `csl:content:${courseId}`;
    const cachedCourse = this.cache.getObject(cacheKey);
    if (cachedCourse == null) {
      const course = await this.clientService.getCourseWithId(courseId);
      const convertedCourse = await this.mapCourseToLearningMaterial(course);
      this.cache.setObject(cacheKey, convertedCourse);
      return convertedCourse;
    } else {
      return cachedCourse;
    }
  }

  private async mapCourseToLearningMaterial(
    CSLMaterial: Course,
  ): Promise<LearningMaterial> {
    return {
      source: 'csl',
      id: CSLMaterial.id,
      description: CSLMaterial.description,
      shortDescription: CSLMaterial.shortDescription,
      outcomes: CSLMaterial.learningOutcomes,
      title: CSLMaterial.title,
      sourceHref: '',
    };
  }
}
