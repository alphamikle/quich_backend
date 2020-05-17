import { PipeTransform, UseFilters, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ArrayNotEmpty, IsEmail, IsMobilePhone, IsNotEmpty, Length } from 'class-validator';
import { TransformPipe } from '~/providers/transform.pipe';
import { ValidationPipe } from '~/providers/validation.pipe';
import { RU } from '~/locale/ru';
import { RpcExceptionFilter } from '~/providers/rpc-exception.filter';
import { ValidateUserTokenPipe } from '~/user/pipes/validate-user-token.pipe';

export function Transform<T>(target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void | TypedPropertyDescriptor<T> {
  return UsePipes(TransformPipe, ValidationPipe)(target, propertyKey as string, descriptor);
}

export function Grpc<T>(target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void | TypedPropertyDescriptor<T> {
  const grpcDescriptor = GrpcMethod()(target, propertyKey, descriptor) as TypedPropertyDescriptor<T>;
  const exceptionDescriptor = UseFilters(RpcExceptionFilter)(target, propertyKey as string, grpcDescriptor) as TypedPropertyDescriptor<T>;
  return Transform(target, propertyKey, exceptionDescriptor as TypedPropertyDescriptor<T>);
}

export function GRPC<T>(...pipes: (PipeTransform | Function)[]): MethodDecorator {
  function methodDecorator(target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
    const grpcDescriptor = GrpcMethod()(target, propertyKey, descriptor) as TypedPropertyDescriptor<T>;
    const exceptionDescriptor = UseFilters(RpcExceptionFilter)(target, propertyKey as string, grpcDescriptor) as TypedPropertyDescriptor<T>;
    return UsePipes(TransformPipe, ValidationPipe, ...pipes)(target, propertyKey as string, exceptionDescriptor) as TypedPropertyDescriptor<T>;
  }

  return methodDecorator as MethodDecorator;
}

export function securedGrpc<T>(target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void | TypedPropertyDescriptor<T> {
  const grpcDescriptor = GrpcMethod()(target, propertyKey, descriptor) as TypedPropertyDescriptor<T>;
  const exceptionDescriptor = UseFilters(RpcExceptionFilter)(target, propertyKey as string, grpcDescriptor) as TypedPropertyDescriptor<T>;
  return UsePipes(TransformPipe, ValidationPipe, ValidateUserTokenPipe)(target, propertyKey as string, exceptionDescriptor) as TypedPropertyDescriptor<T>;
}

export function securedGRPC<T>(...pipes: (PipeTransform | Function)[]): MethodDecorator {
  function methodDecorator(target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
    const grpcDescriptor = GrpcMethod()(target, propertyKey, descriptor) as TypedPropertyDescriptor<T>;
    const exceptionDescriptor = UseFilters(RpcExceptionFilter)(target, propertyKey as string, grpcDescriptor) as TypedPropertyDescriptor<T>;
    return UsePipes(TransformPipe, ValidationPipe, ValidateUserTokenPipe, ...pipes)(target, propertyKey as string, exceptionDescriptor) as TypedPropertyDescriptor<T>;
  }

  return methodDecorator as MethodDecorator;
}

export const localeIsEmail = IsEmail({}, { message: RU.isEmailError });

export const localeIsNotEmpty = IsNotEmpty({ message: RU.isNotEmptyError });

export const localeIsTooShort = Length(6, 20, { message: RU.isTooShortError });

export const localeIsMobilePhone = IsMobilePhone('ru-RU', {}, { message: RU.incorrectPhone });

export const localeArrayIsNotEmpty = ArrayNotEmpty({ message: 'Выберите хотя-бы одно значение' });