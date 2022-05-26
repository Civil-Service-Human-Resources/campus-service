import { ApiProperty } from '@nestjs/swagger';
import { ParagraphContent } from './ParagraphContent';

export class LearningMaterial {
  @ApiProperty()
  source: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({
    description: 'Array of paragraphs that make up the description',
    type: [ParagraphContent],
  })
  description: ParagraphContent[];

  @ApiProperty()
  duration: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  shortDescription?: string;

  @ApiProperty({
    description: 'Array of paragraphs that make up the learning outcomes',
    type: [ParagraphContent],
  })
  outcomes: ParagraphContent[];

  @ApiProperty()
  sourceHref: string;
}
