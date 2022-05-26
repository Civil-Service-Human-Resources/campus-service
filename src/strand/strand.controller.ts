import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CacheClient } from '../client/cache/cache-client.interface';
import { AppInsightsLogger } from '../util/logging/appi-logger';
import { PagedStrandCategory } from './models/strand-category.model';
import { Strand } from './models/strand.model';
import { StrandService } from './strand.service';
import { ParseCategoryPipe } from './validators/parse-category.pipe';
import { ParsePagePipe } from './validators/parse-page.pipe';
import { ParseStrandPipe } from './validators/parse-strand.pipe';

@ApiTags('Strands')
@Controller('strands')
export class StrandController {
  private readonly logger = new AppInsightsLogger(StrandController.name);
  constructor(
    private readonly strandService: StrandService,
    private readonly cache: CacheClient<Strand>,
    private readonly categoryCache: CacheClient<PagedStrandCategory>,
  ) {}

  @Get('/:strandId')
  @ApiOkResponse({
    description: 'Strand page detail successfully fetched',
    type: Strand,
  })
  async getStrand(
    @Param('strandId', ParseStrandPipe) strandId: number,
  ): Promise<Strand> {
    const cacheKey = `strands:${strandId}`;
    return await this.cache.getObjectWithCallback(cacheKey, async () => {
      this.logger.debug(
        `Strand cache result for strandId ${strandId} was null`,
      );
      return await this.strandService.getStrandCategories(strandId);
    });
  }

  @Get('/:strandId/categories/:category')
  @ApiOkResponse({
    description: 'Strand category page detail successfully fetched',
    type: PagedStrandCategory,
  })
  async getStrandCategory(
    @Param('strandId', ParseStrandPipe) strandId: number,
    @Param('category', ParseCategoryPipe) category: string,
    @Query('page', ParsePagePipe) page: number,
  ): Promise<PagedStrandCategory> {
    const cacheKey = `strands:${strandId}:${category}:${page}`;
    return await this.categoryCache.getObjectWithCallback(
      cacheKey,
      async () => {
        return await this.strandService.getCoursesForStrandAndCategory(
          strandId,
          category,
          page,
        );
      },
    );
  }
}
