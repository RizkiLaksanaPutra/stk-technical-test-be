import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
