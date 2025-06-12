import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: OrderDto) {
    return this.orderService.createOrder(orderData);
  }
}
