import { Module } from '@nestjs/common';
import { FilmRepository } from '../repository/film.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from '../repository/films.entity';
import { Schedules } from '../repository/schedules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [OrderController],
  providers: [FilmRepository, OrderService],
  exports: [FilmRepository, OrderService],
})
export class OrderModule {}
