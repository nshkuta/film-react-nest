import { Module } from '@nestjs/common';
import { FilmRepository } from 'src/repository/film.repository';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from 'src/repository/film.entity';
import { Schedules } from 'src/repository/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Films, Schedules])],
  controllers: [OrderController],
  providers: [FilmRepository, OrderService],
  exports: [FilmRepository, OrderService],
})
export class OrderModule {}
