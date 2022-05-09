import { Injectable } from '@nestjs/common';
import { LearningMaterial } from '../models/LearningMaterial';
import { LearningMaterialSearchResult } from '../../search/models/LearningmaterialSearchResult';
import { CSLConfig } from './csl.config';
import { Course } from './models/output/course.model';
import { CSLSearchResult } from './models/output/search-results.model';
import { labels, ParagraphContent } from '../models/ParagraphContent';

@Injectable()
export class CSLCourseMapper {
  constructor(private readonly config: CSLConfig) {}

  public async mapSearchResultsToLearningMaterial(
    results: CSLSearchResult,
    originalPage: number,
  ): Promise<LearningMaterialSearchResult> {
    const convertedCourses = await Promise.all(
      results.results.map(
        async (c) => await this.mapCourseToLearningMaterial(c),
      ),
    );
    return {
      page: originalPage,
      results: convertedCourses,
      size: results.size,
      totalResults: results.totalResults,
    };
  }

  public async mapCourseToLearningMaterial(
    CSLMaterial: Course,
  ): Promise<LearningMaterial> {
    const totalDuration = Math.ceil(
      (await this.getTotalDuration(CSLMaterial)) / 60,
    );
    const descFormatted = this.splitTextBody(CSLMaterial.description);
    const outcomesFormatted = this.splitTextBody(CSLMaterial.learningOutcomes);
    return {
      source: 'csl',
      id: CSLMaterial.id,
      description: descFormatted,
      shortDescription: CSLMaterial.shortDescription,
      outcomes: outcomesFormatted,
      title: CSLMaterial.title,
      duration: totalDuration,
      type: await this.getCourseType(CSLMaterial),
      sourceHref: `${this.config.frontendUrl}/courses/${CSLMaterial.id}`,
    };
  }

  private splitTextBody = (text: string): ParagraphContent[] => {
    const resultContent: ParagraphContent[] = [];

    if (text) {
      const lines = text
        .split('\n')
        .filter((line) => !!line)
        .map((line) => line.trim());

      let currentParagraph: ParagraphContent;
      let inList = false;
      for (let line of lines) {
        if (line.startsWith('•')) {
          if (!inList) {
            inList = true;
            currentParagraph = { label: labels.BULLETS, content: [] };
          }
          line = line.replace(/[•\t]/g, '');
          currentParagraph.content.push(line);
        } else {
          if (inList) {
            inList = false;
            resultContent.push(currentParagraph);
          }
          if (line.length > 0) {
            resultContent.push({ label: labels.PARAGRAPH, content: [line] });
          }
        }
      }
    }

    return resultContent;
  };

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
