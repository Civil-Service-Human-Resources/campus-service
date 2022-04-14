import { Injectable } from '@nestjs/common';
import { LearningMaterial } from '../models/LearningMaterial';
import { CSLConfig } from './csl.config';
import { Course } from './models/output/course.model';

@Injectable()
export class CSLCourseMapper {
  constructor(private readonly config: CSLConfig) {}

  public async mapCourseToLearningMaterial(
    CSLMaterial: Course,
  ): Promise<LearningMaterial> {
    const totalDuration = Math.ceil(
      (await this.getTotalDuration(CSLMaterial)) / 60,
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
      const firstElem = [...moduleTypes][0];
      if (firstElem) {
        const formatted = firstElem.replace(/-/g, ' ');
        return formatted[0].toUpperCase() + formatted.slice(1);
      } else {
        return '';
      }
    }
  };
}
