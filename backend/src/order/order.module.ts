import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRepository, OrderSchema } from 'src/repository/order.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from 'src/films/films.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    FilmsModule,
  ],

  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderRepository, OrderService],
})
export class OrderModule {}
