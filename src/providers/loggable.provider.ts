import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class Loggable {
  private logger = new Logger(this.constructor.name);

  protected log(...args: any[]) {
    this.logger.log(args.map(arg => JSON.stringify(arg)).join(', '));
  }
}