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
  duration: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  shortDescription?: string;

  @ApiProperty()
  outcomes: string;

  @ApiProperty()
  sourceHref: string;
}
