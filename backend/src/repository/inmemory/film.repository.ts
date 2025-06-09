import { Injectable } from '@nestjs/common';
import { FilmDto } from 'src/films/dto/films.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilmRepository {
  private films: FilmDto[] = [];

  constructor() {
    this.films = [
      {
        id: uuid(),
        rating: 2.9,
        director: 'Итан Райт',
        tags: ['Документальный'],
        title: 'Архитекторы общества',
        about:
          'Документальный фильм, исследующий влияние искусственного интеллекта на общество...',
        description: 'Документальный фильм Итана Райт...',
        image: '/images/bg1s.jpg',
        cover: '/images/bg1c.jpg',
      },
    ];
  }

  async findAll(): Promise<FilmDto[]> {
    return this.films;
  }

  async findById(id: string): Promise<FilmDto | undefined> {
    return this.films.find((film) => film.id === id);
  }

  async create(film: FilmDto): Promise<FilmDto> {
    const newFilm = { ...film, id: uuid() };
    this.films.push(newFilm);
    return newFilm;
  }

  async update(id: string, film: FilmDto): Promise<FilmDto | undefined> {
    const index = this.films.findIndex((f) => f.id === id);
    if (index === -1) return undefined;
    this.films[index] = { ...this.films[index], ...film };
    return this.films[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.films.findIndex((f) => f.id === id);
    if (index === -1) return false;
    this.films.splice(index, 1);
    return true;
  }
}
