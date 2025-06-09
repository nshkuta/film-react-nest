import { Injectable } from '@nestjs/common';
import { ScheduleDto } from 'src/films/dto/films.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ScheduleRepository {
  private schedules: ScheduleDto[] = [];

  constructor() {
    // Инициализация тестовыми данными
    this.schedules = [
      {
        id: uuid(),
        daytime: new Date(),
        hall: '2',
        rows: 5,
        seats: 10,
        price: 350,
        taken: ['1:2'],
        filmId: uuid(),
      },
    ];
  }

  async findByFilmId(filmId: string): Promise<ScheduleDto[]> {
    return this.schedules.filter((schedule) => schedule.filmId === filmId);
  }

  async findById(id: string): Promise<ScheduleDto | undefined> {
    return this.schedules.find((schedule) => schedule.id === id);
  }

  async create(schedule: ScheduleDto): Promise<ScheduleDto> {
    const newSchedule = { ...schedule, id: uuid() };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  async update(
    id: string,
    schedule: ScheduleDto,
  ): Promise<ScheduleDto | undefined> {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.schedules[index] = { ...this.schedules[index], ...schedule };
    return this.schedules[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.schedules.splice(index, 1);
    return true;
  }
}
