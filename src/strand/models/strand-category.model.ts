import { ApiProperty } from '@nestjs/swagger';
import { LearningMaterial } from '../../learning-material/models/LearningMaterial';

export class PagedStrandCategory {
  @ApiProperty()
  page: number;

  @ApiProperty({ type: [LearningMaterial] })
  results: LearningMaterial[];

  @ApiProperty()
  totalResults: number;
}
