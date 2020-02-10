import { NestFactory }                    from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger }                         from '@nestjs/common';
import { output }                         from './config';
import { AppModule }                      from './app.module';
import * as pack                          from '../package.json';

const { APP_PORT, NODE_ENV } = process.env;

const configUser = output;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ! Если использовать этот pipe без декораторов валидации - возникает ошибка в рантайме
  // app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  const config = new DocumentBuilder()
    .setTitle(pack.name)
    .setDescription(pack.description)
    .setVersion(pack.version)
    .addTag('user')
    .addBearerAuth('Authorization', 'header')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('open-api', app, document, {
    swaggerOptions: {},
  });

  await app.listen(Number(APP_PORT));
}

bootstrap()
  .then(() =>
    Logger.log(`APP IS STARTED ON PORT ${APP_PORT} WITH URL http://localhost:${APP_PORT}/open-api`, `${NODE_ENV.toUpperCase()} MODE`),
  );
