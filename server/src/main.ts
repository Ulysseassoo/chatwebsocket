import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ 
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['authorization', 'content-type'],
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(4000);
  console.log('Server is running on http://localhost:4000');
}
bootstrap();
