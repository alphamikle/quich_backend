import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class UsingLimitValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    return undefined;
  }

}