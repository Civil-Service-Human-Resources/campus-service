import { Module } from '@nestjs/common';
import { CslModule } from '../learning-material/csl/csl.module';
import { StrandCacheModule } from './cache/strand.cache.module';
import { StrandController } from './strand.controller';

@Module({
  imports: [CslModule, StrandCacheModule],
  controllers: [StrandController],
})
export class StrandModule {}
