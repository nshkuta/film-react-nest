import { Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleDto } from 'src/films/dto/films.dto';

export const ScheduleSchema = new Schema({
  daytime: { type: Date, required: true },
  hall: { type: String, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
  filmId: { type: String, required: true },
});

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<ScheduleDto>,
  ) {}

  async findByFilmId(filmId: string): Promise<ScheduleDto[]> {
    return this.scheduleModel.find({ filmId }).exec();
  }

  async findById(id: string): Promise<ScheduleDto | null> {
    return this.scheduleModel.findById(id).exec();
  }

  async create(schedule: ScheduleDto): Promise<ScheduleDto> {
    const newSchedule = new this.scheduleModel(schedule);
    return newSchedule.save();
  }

  async update(id: string, schedule: ScheduleDto): Promise<ScheduleDto | null> {
    return this.scheduleModel
      .findByIdAndUpdate(id, schedule, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.scheduleModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
