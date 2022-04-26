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
    const convertedValue: string = value;
    const categories = await this.cslContentService.getAllCategories();
    if (!categories.includes(convertedValue)) {
      throw new BadRequestException('invalid category supplied');
    }
    return convertedValue;
  }
}
