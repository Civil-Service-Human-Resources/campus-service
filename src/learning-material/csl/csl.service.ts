import { Injectable } from '@nestjs/common';
import { LearningMaterial } from '../models/LearningMaterial';
import { ClientService } from './client/client.service';
import { Course } from './models/output/course.model';

@Injectable()
export class CslService {
  constructor(private readonly clientService: ClientService) {}

  async getCourse(courseId: string) {
    const course = await this.clientService.getCourseWithId(courseId);
    return await this.mapCourseToLearningMaterial(course);
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