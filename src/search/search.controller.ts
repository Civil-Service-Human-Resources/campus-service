import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LearningMaterialSearchResult } from '../learning-material/models/LearningmaterialSearchResult';
import { ParsePagePipe } from '../strand/validators/parse-page.pipe';
import { SearchService } from './search.service';

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
    @Query('query') criteria: string,
    @Query('page', ParsePagePipe) page: number,
  ): Promise<LearningMaterialSearchResult> {
    return await this.service.search(criteria, page);
  }
}
