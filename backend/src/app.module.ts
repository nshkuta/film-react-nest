import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { DatabaseModule } from './database.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
    }),
    DatabaseModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider],
})
export class AppModule {}
