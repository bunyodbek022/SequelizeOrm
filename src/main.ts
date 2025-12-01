import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInteraptor } from './interaptors/loggingInteraptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalInterceptors(new LoggingInteraptor);  // 3-usul
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
