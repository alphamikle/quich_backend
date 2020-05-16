import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Timestamp } from '~/protobuf/generated/google/protobuf/timestamp';

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

export class DateToTimestampInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const response = await next.handle().toPromise();
    const transform = this.handleObject(response);
    return transform;
  }

  private handleObject(object: any): any {
    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i += 1) {
        object[i] = this.handleObject(object[i]);
      }
    } else if (typeof object === 'object' && object !== null && !(object instanceof Date)) {
      const keys = Object.getOwnPropertyNames(object);
      for (const key of keys) {
        object[key] = this.handleObject(object[key]);
      }
    } else if (object instanceof Date) {
      return toTimestamp(object);
    }
    return object;
  }

}