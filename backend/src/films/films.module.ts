import { Module } from '@nestjs/common';
import { FilmRepository } from 'src/repository/film.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from 'src/repository/film.entity';
import { Schedules } from 'src/repository/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [FilmsController],
  providers: [FilmRepository, FilmsService],
  exports: [FilmRepository, FilmsService],
})
export class FilmsModule {}
