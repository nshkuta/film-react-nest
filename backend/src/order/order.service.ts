import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderRepository } from 'src/repository/order.repository';
import { ScheduleRepository } from 'src/repository/schedule.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async createOrder(order: OrderDto): Promise<OrderDto> {
    // Проверяем существование сеанса
    const session = await this.scheduleRepository.findById(order.session);
    if (!session) {
      throw new Error('Сеанс не найден');
    }

    // Проверяем доступность места
    const seatKey = `${order.row}:${order.seat}`;
    if (session.taken.includes(seatKey)) {
      throw new Error('Место уже занято');
    }

    // Создаем заказ
    const newOrder = await this.orderRepository.create(order);

    // Обновляем статус места как занятого
    session.taken.push(seatKey);
    await this.scheduleRepository.update(order.session, session);

    return newOrder;
  }

  async getOrders(): Promise<OrderDto[]> {
    return this.orderRepository.getAll();
  }

  async getOrderById(id: string): Promise<OrderDto | undefined> {
    return this.orderRepository.findById(id);
  }

  async getOrdersByFilmAndSession(
    film: string,
    session: string,
  ): Promise<OrderDto[]> {
    return this.orderRepository.findByFilmAndSession(film, session);
  }

  async cancelOrder(id: string): Promise<boolean> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Заказ не найден');
    }

    // Освобождаем место в расписании
    const session = await this.scheduleRepository.findById(order.session);
    if (session) {
      const seatKey = `${order.row}:${order.seat}`;
      session.taken = session.taken.filter((taken) => taken !== seatKey);
      await this.scheduleRepository.update(order.session, session);
    }

    return this.orderRepository.delete(id);
  }

  // Проверка возможности создания заказа
  async canCreateOrder(order: OrderDto): Promise<boolean> {
    const session = await this.scheduleRepository.findById(order.session);
    if (!session) return false;

    const seatKey = `${order.row}:${order.seat}`;
    return !session.taken.includes(seatKey);
  }
}
