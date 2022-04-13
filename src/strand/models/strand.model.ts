import { ApiProperty } from '@nestjs/swagger';

export class Strand {
  @ApiProperty()
  strandId: number;

  @ApiProperty()
  categoriesToDisplay: string[];
}
