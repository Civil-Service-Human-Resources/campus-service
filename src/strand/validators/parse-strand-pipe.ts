import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CSLContentService } from '../../learning-material/csl/content-mapping/content.service';

@Injectable()
export class ParseStrandPipe implements PipeTransform {
  constructor(private readonly cslContentService: CSLContentService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const strands = [1, 2, 3, 4, 5];
    const convertedValue = parseInt(value);
    if (!convertedValue || !strands.includes(convertedValue)) {
      throw new BadRequestException('invalid strand supplied');
    } else {
      return convertedValue;
    }
  }
}
