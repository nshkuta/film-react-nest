import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmRepository } from '../repository/film.repository';

class MockFilmRepository {
  findAllFilms() {
    return Promise.resolve([mockFilm]);
  }

  findFilmById(id: string) {
    console.log(id);
    return Promise.resolve(mockFilm);
  }

  findScheduleByFilmId(filmId: string) {
    console.log(filmId);
    return Promise.resolve(mockSchedules);
  }
}

const mockFilm: FilmDto = {
  id: '1',
  rating: 8.5,
  director: 'Director Name',
  tags: ['action', 'adventure'],
  title: 'Test Film',
  about: 'Short description',
  description: 'Full description',
  image: 'image-url',
  cover: 'cover-url',
  schedule: [],
};

const mockSchedules: ScheduleDto[] = [
  {
    id: '1',
    daytime: new Date(),
    hall: 'Hall 1',
    rows: 10,
    seats: 100,
    price: 500,
    taken: [],
    filmId: '1',
  },
];

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: FilmRepository,
          useClass: MockFilmRepository,
        },
      ],
    })
      .overrideProvider(FilmsService)
      .useValue({
        getFilms: jest.fn(() =>
          Promise.resolve({ total: 1, items: [mockFilm] }),
        ),
        getFilmById: jest.fn(() => Promise.resolve(mockFilm)),
        getSchedule: jest.fn(() => Promise.resolve(mockSchedules)),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('should return list of films', async () => {
      const result = await controller.getFilms();
      expect(result).toEqual({ total: 1, items: [mockFilm] });
      expect(service.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSchedule', () => {
    it('should return schedule for film', async () => {
      const result = await controller.getSchedule('1');
      expect(result).toEqual({
        total: mockSchedules.length,
        items: mockSchedules,
      });
      expect(service.getSchedule).toHaveBeenCalledWith('1');
    });
  });
});
