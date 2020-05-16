import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { aBaseConfig } from '~/config';
import { AppModule } from '~/app.module';
import { DateToTimestampInterceptor } from '~/providers/date-to-timestamp.interceptor';

const { LOCALHOST } = process.env;

aBaseConfig();
const start = Date.now();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'bos',
      protoPath: join(__dirname, '..', 'proto/main.proto'),
      url: LOCALHOST,
      maxSendMessageLength: 314572800,
      maxReceiveMessageLength: 314572800,
    },
  });
  app.useGlobalInterceptors(new DateToTimestampInterceptor());
  await app.listen(() => Logger.log('Microservice is started'));
}

bootstrap().then(() => Logger.log(`App is loaded in ${ Date.now() - start }ms`));
