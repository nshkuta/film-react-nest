import { Injectable } from '@nestjs/common';
import { OrderDto } from 'src/order/dto/order.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderRepository {
  private orders: OrderDto[] = [];
  private orderIds: string[] = [];

  constructor() {
    this.orders = [
      {
        id: uuid(),
        film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
        daytime: new Date(),
        row: 2,
        seat: 5,
        price: 350,
      },
    ];
    this.orderIds = this.orders.map((order) => order.id);
  }

  async create(order: OrderDto): Promise<OrderDto> {
    const newOrder = {
      ...order,
      id: uuid(),
    };
    this.orders.push(newOrder);
    this.orderIds.push(newOrder.id);
    return newOrder;
  }

  async findById(id: string): Promise<OrderDto | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async findByFilmAndSession(
    film: string,
    session: string,
  ): Promise<OrderDto[]> {
    return this.orders.filter(
      (order) => order.film === film && order.session === session,
    );
  }

  async update(id: string, order: OrderDto): Promise<OrderDto | undefined> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;
    this.orders[index] = { ...this.orders[index], ...order };
    return this.orders[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    this.orderIds.splice(this.orderIds.indexOf(id), 1);
    return true;
  }

  async getAll(): Promise<OrderDto[]> {
    return this.orders;
  }

  async getOrderIds(): Promise<string[]> {
    return this.orderIds;
  }
}
