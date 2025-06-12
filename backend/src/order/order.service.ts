import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async createOrder(orderData: OrderDto): Promise<OrderDto> {
    return this.filmRepository.createOrder(orderData);
  }
}
