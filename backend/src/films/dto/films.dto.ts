export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: ScheduleDto[];
}

export class ScheduleDto {
  id: string;
  daytime: Date;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
  filmId: string;
}
