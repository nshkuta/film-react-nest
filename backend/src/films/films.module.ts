import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmRepository, FilmSchema } from 'src/repository/film.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import {
  ScheduleRepository,
  ScheduleSchema,
} from 'src/repository/schedule.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
  ],

  controllers: [FilmsController],
  providers: [FilmRepository, ScheduleRepository, FilmsService],
  exports: [FilmRepository, ScheduleRepository, FilmsService],
})
export class FilmsModule {}
