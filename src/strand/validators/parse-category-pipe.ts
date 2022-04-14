import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
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
      throw new NotFoundException('invalid category supplied');
    }
    return convertedValue;
  }
}
