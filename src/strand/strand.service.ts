import { Injectable } from '@nestjs/common';
import { CSLContentService } from '../learning-material/csl/content-mapping/content.service';
import { CslService } from '../learning-material/csl/csl.service';
import { LearningMaterial } from '../learning-material/models/LearningMaterial';
import { AppInsightsLogger } from '../util/logging/appi-logger';
import { PagedStrandCategory } from './models/strand-category.model';
import { Strand } from './models/strand.model';

@Injectable()
export class StrandService {
  private readonly logger = new AppInsightsLogger(StrandService.name);
  constructor(
    private readonly cslContentService: CSLContentService,
    private readonly cslService: CslService,
  ) {}

  async getStrandCategories(strandId: number): Promise<Strand> {
    this.logger.debug(`Fetching strand ${strandId}`);
    const categories =
      await this.cslContentService.getRelevantCategoriesForStrand(strandId);
    const strand: Strand = {
      strandId: strandId,
      categoriesToDisplay: Array.from(categories).sort((a, b) => {
        return a.localeCompare(b, 'en', { sensitivity: 'base' });
      }),
    };
    return strand;
  }

  async getCoursesForStrandAndCategory(
    strandId: number,
    category: string,
    page: number,
  ): Promise<PagedStrandCategory> {
    const recordsPerPage = 10;
    const courseIds =
      await this.cslContentService.getCoursesForStrandAndCategory(
        strandId,
        category,
      );
    const courseData = await this.cslService.getMultipleCourses(courseIds);
    const orderedData = courseData.sort((a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }),
    );
    const pageData: LearningMaterial[] = orderedData.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage,
    );
    return {
      page: page,
      results: pageData,
      totalResults: orderedData.length,
    };
  }
}
