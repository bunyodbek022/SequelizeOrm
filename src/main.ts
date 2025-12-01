import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInteraptor } from './interaptors/loggingInteraptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new LoggingInteraptor);  // 3-usul
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
