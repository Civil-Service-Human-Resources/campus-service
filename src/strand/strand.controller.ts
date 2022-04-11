import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CacheClient } from '../client/cache/cache-client.interface';
import { CSLContentService } from '../learning-material/csl/content-mapping/content.service';
import { AppInsightsLogger } from '../util/logging/appi-logger';
import { Strand } from './models/strand.model';

@Controller('strands')
export class StrandController {
  private readonly logger = new AppInsightsLogger(StrandController.name);
  constructor(
    private readonly cslContentService: CSLContentService,
    private readonly cache: CacheClient<Strand>,
  ) {}

  @Get('/:strandId')
  @ApiOkResponse({
    description: 'Strand page detail successfully fetched',
    type: Strand,
  })
  async getStrand(@Param('strandId') strandId: number): Promise<Strand> {
    const cacheKey = `strands:${strandId}`;
    const cachedResult = await this.cache.getObject(cacheKey);
    if (cachedResult == null) {
      this.logger.debug(
        `Strand cache result for strandId ${strandId} was null`,
      );
      const categories =
        await this.cslContentService.getRelevantCategoriesForStrand(strandId);
      const strand: Strand = {
        strandId: strandId,
        categoriesToDisplay: Array.from(categories),
      };
      await this.cache.setObject(cacheKey, strand);
      return strand;
    } else {
      return cachedResult;
    }
  }
}
