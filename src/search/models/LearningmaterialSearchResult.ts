import { ApiProperty } from '@nestjs/swagger';
import { LearningMaterial } from '../../learning-material/models/LearningMaterial';

export class LearningMaterialSearchResult {
  @ApiProperty()
  page: number;

  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  size: number;

  @ApiProperty({ type: [LearningMaterial] })
  results: LearningMaterial[];
}
