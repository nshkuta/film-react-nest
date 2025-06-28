import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './films.entity';
import { Schedules } from './schedules.entity';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { OrderDto } from 'src/order/dto/order.dto';
import { FilmDto, ScheduleDto } from 'src/films/dto/films.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectRepository(Films) private readonly filmRepository: Repository<Films>,
    @InjectRepository(Schedules)
    private readonly scheduleRepository: Repository<Schedules>,
  ) {}

  private mapFilmToDto(film: Films): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags ? film.tags.split(',') : [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedules.map((schedule) => ({
        id: schedule.id,
        daytime: new Date(schedule.daytime),
        hall: schedule.hall.toString(),
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: schedule.taken ? schedule.taken.split(',') : [],
        filmId: film.id,
      })),
    };
  }
  async findAllFilms(): Promise<FilmDto[]> {
    try {
      const films = await this.filmRepository.find({
        relations: ['schedules'],
      });
      return films.map((film) => this.mapFilmToDto(film));
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении фильмов');
    }
  }

  async findFilmById(id: string): Promise<FilmDto | null> {
    try {
      const film = await this.filmRepository.findOneBy({
        id,
      });

      if (film) {
        return this.mapFilmToDto(film);
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении фильма');
    }
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    try {
      const schedules = await this.scheduleRepository.find({
        where: {
          film: {
            id: filmId,
          },
        },
        relations: ['film'],
      });
      if (!schedules.length) {
        throw new NotFoundException('Расписание не найдено');
      }

      const scheduleDtos = schedules.map((schedule) => ({
        id: schedule.id,
        daytime: new Date(schedule.daytime),
        hall: schedule.hall.toString(),
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: schedule.taken ? schedule.taken.split(',') : [],
        filmId: schedule.film.id,
      }));

      return scheduleDtos;
    } catch (error) {
      console.log(error);
      throw new Error('Ошибка при получении расписания');
    }
  }

  async checkSeatAvailability(
    filmId: string,
    scheduleId: string,
    seat: string,
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOneBy({
      id: scheduleId,
      film: {
        id: filmId,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Сеанс не найден');
    }

    return !schedule.taken.includes(seat);
  }

  async createOrder(orderData: OrderDto): Promise<any> {
    // Проверяем доступность места
    const isAvailable = await this.checkSeatAvailability(
      orderData.film,
      orderData.session,
      `${orderData.row}:${orderData.seat}`,
    );

    if (!isAvailable) {
      throw new ConflictException('Место уже занято');
    }

    const schedule = await this.scheduleRepository.findOneBy({
      id: orderData.session,
    });

    if (schedule) {
      const currentTaken = schedule.taken ? schedule.taken.split(',') : [];
      const updatedTaken = [
        ...currentTaken,
        `${orderData.row}:${orderData.seat}`,
      ];
      const takenString = updatedTaken.join(',');

      await this.scheduleRepository.update(
        { id: orderData.session },
        { taken: takenString },
      );
    }

    orderData.id = uuidv4();

    return orderData;
  }
}
