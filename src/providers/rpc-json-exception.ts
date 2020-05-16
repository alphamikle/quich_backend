import { RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { PropertyError } from '~/providers/property-error';

export class RpcJsonException extends RpcException {
  constructor(exception: PropertyError | PropertyError[], code = status.UNKNOWN) {
    if (!Array.isArray(exception)) {
      exception = [exception];
    }
    const json = JSON.stringify(exception);
    super({ code, message: json });
  }
}

export function rpcJsonException(exception: PropertyError | PropertyError[], code?: status) {
  return new RpcJsonException(exception, code);
}