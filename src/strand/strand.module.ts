import { Module } from '@nestjs/common';
import { CslModule } from '../learning-material/csl/csl.module';
import { StrandCacheModule } from './cache/strand.cache.module';
import { StrandController } from './strand.controller';
import { StrandService } from './strand.service';

@Module({
  imports: [CslModule, StrandCacheModule],
  providers: [StrandService],
  controllers: [StrandController],
})
export class StrandModule {}
