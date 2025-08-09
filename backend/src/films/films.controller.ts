import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const sessions = await this.filmsService.getSchedule(id);
    return {
      total: sessions.length,
      items: sessions,
    };
  }
}
