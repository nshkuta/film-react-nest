import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmDto[]> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<ScheduleDto[]> {
    return this.filmsService.getSchedule(id);
  }
}
