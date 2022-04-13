import { Injectable } from '@nestjs/common';
import { CacheClient } from '../../client/cache/cache-client.interface';
import { LearningMaterial } from '../models/LearningMaterial';
import { ClientService } from './client/client.service';
import { CSLConfig } from './csl.config';
import { Course } from './models/output/course.model';

@Injectable()
export class CslService {
  constructor(
    private readonly clientService: ClientService,
    private readonly cache: CacheClient<LearningMaterial>,
    private readonly config: CSLConfig,
  ) {}

  async getCourse(courseId: string) {
    const cacheKey = `csl:content:${courseId}`;
    const cachedCourse = await this.cache.getObject(cacheKey);
    if (cachedCourse == null) {
      const course = await this.clientService.getCourseWithId(courseId);
      const convertedCourse = await this.mapCourseToLearningMaterial(course);
      await this.cache.setObject(cacheKey, convertedCourse);
      return convertedCourse;
    } else {
      return cachedCourse;
    }
  }

  private async mapCourseToLearningMaterial(
    CSLMaterial: Course,
  ): Promise<LearningMaterial> {
    const totalDuration = Math.ceil(
      (await this.getTotalDuration(CSLMaterial)) / 1000,
    );
    return {
      source: 'csl',
      id: CSLMaterial.id,
      description: CSLMaterial.description,
      shortDescription: CSLMaterial.shortDescription,
      outcomes: CSLMaterial.learningOutcomes,
      title: CSLMaterial.title,
      duration: totalDuration,
      type: await this.getCourseType(CSLMaterial),
      sourceHref: `${this.config.frontendUrl}/courses/${CSLMaterial.id}`,
    };
  }

  private getTotalDuration = async (course: Course) => {
    return course.modules.reduce((sum, current) => sum + current.duration, 0);
  };

  private getCourseType = async (course: Course) => {
    const moduleTypes = new Set(course.modules.map((m) => m.moduleType));
    if (moduleTypes.size > 1) {
      return 'Blended';
    } else {
      return [...moduleTypes][0];
    }
  };
}
