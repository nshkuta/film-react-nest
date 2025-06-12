import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FilmRepository,
  FilmSchema,
  OrderSchema,
} from 'src/repository/film.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmRepository, FilmsService],
  exports: [FilmRepository, FilmsService],
})
export class FilmsModule {}
