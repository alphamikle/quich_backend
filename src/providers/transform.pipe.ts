import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Converter } from '~/providers/converter.provider';

@Injectable()
export class TransformPipe<T> extends Converter implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata): T {
    return this.convert(value, metadata.metatype as ClassType<T>);
  }
}
