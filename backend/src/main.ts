if (typeof crypto === 'undefined') {
  global.crypto = require('crypto');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { JsonLogger } from './logger/json.logger';
import { DevLogger } from './logger/dev.logger';
import { TSKVLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(new JsonLogger('App'));
  app.useLogger(new DevLogger('App'));
  app.useLogger(new TSKVLogger('App'));
  await app.listen(3000);
}
bootstrap();
