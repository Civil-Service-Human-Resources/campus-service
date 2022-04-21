import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePagePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const convertedValue = parseInt(value);
    if (!convertedValue) {
      return 1;
    } else {
      if (convertedValue < 0) {
        return 1;
      }
      return convertedValue;
    }
  }
}
