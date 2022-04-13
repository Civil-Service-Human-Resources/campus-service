import { Injectable } from '@nestjs/common';
import { CSLContentService } from '../learning-material/csl/content-mapping/content.service';
import { AppInsightsLogger } from '../util/logging/appi-logger';
import { Strand } from './models/strand.model';

@Injectable()
export class StrandService {
  private readonly logger = new AppInsightsLogger(StrandService.name);
  constructor(private readonly cslContentService: CSLContentService) {}

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
}
