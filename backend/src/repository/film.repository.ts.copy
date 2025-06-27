import { Schema } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from 'src/films/dto/films.dto';
import { ScheduleDto } from 'src/films/dto/films.dto';
import { OrderDto } from 'src/order/dto/order.dto';

// Схема для фильмов
export const FilmSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  schedule: [
    {
      daytime: { type: Date, required: true },
      hall: { type: Number, required: true },
      rows: { type: Number, required: true },
      seats: { type: Number, required: true },
      price: { type: Number, required: true },
      taken: { type: [String], default: [], required: false },
    },
  ],
});

export const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  film: { type: String, required: true },
  session: { type: String, required: true },
  row: { type: Number, required: true },
  seat: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

@Injectable()
export class FilmRepository {
  constructor(
    @InjectModel('Film') private readonly filmModel: Model<FilmDto>,
    @InjectModel('Order') private readonly orderModel: Model<OrderDto>,
  ) {}

  // Методы для работы с фильмами
  async findAllFilms(): Promise<FilmDto[]> {
    return this.filmModel.find().exec();
  }

  async findFilmById(id: string): Promise<FilmDto | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    try {
      const film = await this.filmModel.findOne({ id: filmId }).exec();
      if (!film) {
        throw new Error('Фильм не найден');
      }
      return film.schedule || [];
    } catch (error) {
      throw new Error('Ошибка при получении расписания');
    }
  }

  async checkSeatAvailability(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<boolean> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException('Сеанс не найден');
    }

    return !session.taken.includes(seat);
  }

  async createOrder(orderData: OrderDto): Promise<OrderDto> {
    // Проверяем доступность места
    const isAvailable = await this.checkSeatAvailability(
      orderData.film,
      orderData.session,
      `${orderData.row}:${orderData.seat}`,
    );

    if (!isAvailable) {
      throw new ConflictException('Место уже занято');
    }

    // Создаем заказ
    const newOrder = new this.orderModel(orderData);
    return await newOrder.save();
  }
}
