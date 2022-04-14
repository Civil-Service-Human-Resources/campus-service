import { Module } from '@nestjs/common';
import { CslModule } from '../learning-material/csl/csl.module';
import { SearchCacheModule } from './cache/search.cache.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [CslModule, SearchCacheModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
