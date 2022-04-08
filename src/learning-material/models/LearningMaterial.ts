import { ApiProperty } from '@nestjs/swagger';

export class LearningMaterial {
  @ApiProperty()
  source: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  shortDescription?: string;

  @ApiProperty()
  outcomes: string;

  @ApiProperty()
  sourceHref: string;
}
