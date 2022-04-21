import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LearningMaterialSearchResult } from './models/LearningmaterialSearchResult';
import { ParsePagePipe } from '../strand/validators/parse-page.pipe';
import { SearchService } from './search.service';
import { ParseSearchQueryPipe } from './validators/search.query.pipe';

@ApiTags('Search')
@Controller('/search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  @ApiOkResponse({
    description: 'Search page detail successfully fetched',
    type: LearningMaterialSearchResult,
  })
  async search(
    @Query('query', ParseSearchQueryPipe) query: string,
    @Query('page', ParsePagePipe) page: number,
  ): Promise<LearningMaterialSearchResult> {
    return await this.service.search(query, page);
  }
}
