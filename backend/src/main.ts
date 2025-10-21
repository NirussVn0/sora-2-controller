import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: configService.get<string>('frontendOrigin') ?? true,
    credentials: true
  });

  app.use('/uploads', express.static(join(process.cwd(), 'storage')));

  const port = configService.get<number>('port') ?? 4000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
