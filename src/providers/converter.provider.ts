import { Global, Injectable } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ClassTransformOptions, plainToClass, plainToClassFromExist } from 'class-transformer';
import { Loggable } from '~/providers/loggable.provider';
import { ConvertWithDiff, Diff } from '~/global-types';

const options: ClassTransformOptions = {
  // enableImplicitConversion: true,
  enableCircularCheck: true,
};

@Global()
@Injectable()
export class Converter extends Loggable {
  convert<T extends Record<string, any>, R>(from: T, to: ClassType<R>): R {
    return plainToClass(to, from, options);
  }

  convertWithDiff<T, R>(from: T, to: ClassType<R>): ConvertWithDiff<R, T> {
    const converted = this.convert(from, to);
    const diff = {} as Diff<R, T>;
    return [converted, diff];
  }

  addToClass<F, S>(partOf: Diff<F, S>, to: F): F {
    return plainToClassFromExist(to, partOf, options);
  }

  removeProperties<T, U extends keyof T>(instance: T, properties: U[]) {
    let copyOfInstance: Record<string, any> = instance;
    for (let i = 0; i < properties.length; i++) {
      copyOfInstance = this.removeProperty(instance, properties[i]);
    }
    return copyOfInstance;
  }

  removeProperty<T, U extends keyof T>(instance: T, prop: U): Omit<T, U> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [prop]: removedProp, ...otherProps } = instance;
    return { ...otherProps };
  }
}