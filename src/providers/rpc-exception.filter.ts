import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { ArgumentsHost, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PropertyError } from '~/providers/property-error';
import { rpcJsonException } from '~/providers/rpc-json-exception';

const { NODE_ENV } = process.env;

@Injectable()
export class RpcExceptionFilter<T extends RpcException, R> extends BaseRpcExceptionFilter<T, R> {

  catch(exception: T, host: ArgumentsHost): Observable<R> {
    Logger.error(exception);
    // if (NODE_ENV !== 'development') {
    //   this.sentry.app = '';
    //   this.sentry.instance().captureException(exception);
    // }
    let message: PropertyError;
    try {
      message = JSON.parse(exception.message);
    } catch (parseError) {
      message = PropertyError.fromString(exception.message);
    }
    try {
      exception = rpcJsonException(message, (exception.getError() as any).code) as T;
    } catch (error) {
      Logger.error(error);
      exception = rpcJsonException(message) as T;
    }
    return super.catch(exception, host);
  }
}