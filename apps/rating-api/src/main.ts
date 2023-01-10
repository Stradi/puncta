import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Having `whitelist: true` causes `@Args` to not properly parsed
      // while passing arguments DTO decorated with `InputType` decorator
      transform: true,
      transformOptions: { enableImplicitConversion: true, enableCircularCheck: true },
    }),
  );
  await app.listen(3000);
}
bootstrap();
