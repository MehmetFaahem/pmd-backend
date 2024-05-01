import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import configuration from 'src/config/configuration';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  const config = configuration.call(this);
  const appVersion = '/api';

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        if (validationErrors[0].children.length)
          return new BadRequestException(
            Object.values(validationErrors[0].children[0].constraints)[0],
          );
        else
          return new BadRequestException(
            Object.values(validationErrors[0].constraints)[0],
          );
      },
    }),
  );

  app.setGlobalPrefix(appVersion);

  const port = config.port || 3000;
  await app.listen(port);
  Logger.log(port, 'AppsRunningPort');
}
bootstrap();
