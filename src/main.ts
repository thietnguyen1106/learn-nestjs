import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANTS } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? CONSTANTS.DEFAULT.APP_PORT);
}

bootstrap();
