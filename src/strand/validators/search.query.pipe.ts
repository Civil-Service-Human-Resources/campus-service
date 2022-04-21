import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import xss from 'xss';

@Injectable()
export class ParseSearchQueryPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const res = xss(value);
  }
}
