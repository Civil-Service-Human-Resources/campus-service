import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CacheClient } from '../client/cache/cache-client.interface';
import { CSLContentService } from '../learning-material/csl/content-mapping/content.service';
import { AppInsightsLogger } from '../util/logging/appi-logger';
import { PagedStrandCategory } from './models/strand-category.model';
import { Strand } from './models/strand.model';
import { StrandService } from './strand.service';
import { ParseCategoryPipe } from './validators/parse-category-pipe';

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
  async getStrand(@Param('strandId') strandId: number): Promise<Strand> {
    const cacheKey = `strands:${strandId}`;
    let res = await this.cache.getObject(cacheKey);
    if (res == null) {
      this.logger.debug(
        `Strand cache result for strandId ${strandId} was null`,
      );
      res = await this.strandService.getStrandCategories(strandId);
      await this.cache.setObject(cacheKey, res);
    }
    return res;
  }

  @Get('/:strandId/categories/:category')
  async getStrandCategory(
    @Param('strandId', ParseIntPipe) strandId: number,
    @Param('category', ParseCategoryPipe) category: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<PagedStrandCategory> {
    const cacheKey = `strands:${strandId}:${category}:${page}`;
    let res = await this.categoryCache.getObject(cacheKey);
    if (!res) {
      res = await this.strandService.getCoursesForStrandAndCategory(
        strandId,
        category,
        page,
      );
      await this.categoryCache.setObject(cacheKey, res);
    }
    return res;
  }
}
