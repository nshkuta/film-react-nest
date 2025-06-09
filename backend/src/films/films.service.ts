import { Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmRepository } from 'src/repository/film.repository';
import { ScheduleRepository } from 'src/repository/schedule.repository';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmById(id: string): Promise<FilmDto | undefined> {
    return this.filmRepository.findById(id);
  }

  async getSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmRepository.findById(filmId);
    if (!film) {
      throw new Error('Фильм не найден');
    }
    return this.scheduleRepository.findByFilmId(filmId);
  }

  async createFilm(film: FilmDto): Promise<FilmDto> {
    return this.filmRepository.create(film);
  }

  async updateFilm(id: string, film: FilmDto): Promise<FilmDto | undefined> {
    return this.filmRepository.update(id, film);
  }

  async deleteFilm(id: string): Promise<boolean> {
    return this.filmRepository.delete(id);
  }

  async createSchedule(schedule: ScheduleDto): Promise<ScheduleDto> {
    return this.scheduleRepository.create(schedule);
  }

  async updateSchedule(
    id: string,
    schedule: ScheduleDto,
  ): Promise<ScheduleDto | undefined> {
    return this.scheduleRepository.update(id, schedule);
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.scheduleRepository.delete(id);
  }

  // Дополнительный метод для проверки занятости мест
  async checkSeatAvailability(
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const session = await this.scheduleRepository.findById(sessionId);
    if (!session) {
      throw new Error('Сеанс не найден');
    }
    return !session.taken.includes(`${row}:${seat}`);
  }
}
