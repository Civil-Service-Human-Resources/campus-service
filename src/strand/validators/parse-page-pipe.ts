import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CSLContentService } from '../../learning-material/csl/content-mapping/content.service';

@Injectable()
export class ParsePagePipe implements PipeTransform {
  constructor(private readonly cslContentService: CSLContentService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const convertedValue = parseInt(value);
    if (!convertedValue) {
      return 1;
    } else {
      return convertedValue;
    }
  }
}
