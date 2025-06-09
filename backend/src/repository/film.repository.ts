import { Schema, Document } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto } from 'src/films/dto/films.dto';
import { v4 as uuid } from 'uuid';

export const FilmSchema = new Schema({
  id: { type: String, required: true, unique: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cover: { type: String, required: true },
});

export interface FilmDocument extends Document {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

@Injectable()
export class FilmRepository {
  constructor(
    @InjectModel('Film') private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmDto | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async create(film: FilmDto): Promise<FilmDto> {
    const newFilm = new this.filmModel({ ...film, id: uuid() });
    return newFilm.save();
  }

  async update(id: string, film: FilmDto): Promise<FilmDto | null> {
    return this.filmModel.findOneAndUpdate({ id }, film, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.filmModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
