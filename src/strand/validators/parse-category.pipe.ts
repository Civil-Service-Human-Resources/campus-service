import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CSLContentService } from '../../learning-material/csl/content-mapping/content.service';

@Injectable()
export class ParseCategoryPipe implements PipeTransform {
  constructor(private readonly cslContentService: CSLContentService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    let convertedValue: string = value;
    convertedValue = convertedValue.replace(/_/g, ' ');
    const categories = await this.cslContentService.getAllCategories();
    if (!categories.includes(convertedValue)) {
      throw new BadRequestException('invalid category supplied');
    }
    return convertedValue;
  }
}
