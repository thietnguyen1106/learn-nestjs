import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONSTANTS } from './config/constants';
import { AppDataSource } from './config/data-source';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  if (!AppDataSource.isInitialized) {
    AppDataSource.initialize()
      .then(() => {
        console.info('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err);
      });
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Reject requests with invalid keys
      forbidNonWhitelisted: true,
      // Automatically transform data types
      transform: true,
      // Remove properties that are not in the DTO
      whitelist: true,
    }),
  );

  await app.listen(process.env.APP_PORT ?? CONSTANTS.DEFAULT.APP_PORT);

  console.info(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
