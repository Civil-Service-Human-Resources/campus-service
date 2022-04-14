import { ApiProperty } from '@nestjs/swagger';
import { LearningMaterial } from './LearningMaterial';

export class LearningMaterialSearchResult {
  @ApiProperty()
  page: number;

  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  results: LearningMaterial[];
}
