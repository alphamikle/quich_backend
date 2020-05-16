import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { PropertyError } from '~/providers/property-error';
import { rpcJsonException } from '~/providers/rpc-json-exception';

@Injectable()
export class ValidationPipe<T> implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata): T {
    const errors = validateSync(value);
    if (errors.length > 0) {
      const propertyErrors = errors.map(error => PropertyError.fromValidationError(error));
      throw rpcJsonException(propertyErrors);
    }
    return value;
  }
}