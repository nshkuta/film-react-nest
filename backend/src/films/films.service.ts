import { Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmRepository.findAllFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmById(id: string): Promise<FilmDto | undefined> {
    return this.filmRepository.findFilmById(id);
  }

  async getSchedule(filmId: string): Promise<ScheduleDto[]> {
    return this.filmRepository.findScheduleByFilmId(filmId);
  }
}
