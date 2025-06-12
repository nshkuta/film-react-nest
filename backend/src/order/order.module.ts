import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FilmRepository,
  FilmSchema,
  OrderSchema,
} from 'src/repository/film.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [FilmRepository, OrderService],
  exports: [FilmRepository, OrderService],
})
export class OrderModule {}
