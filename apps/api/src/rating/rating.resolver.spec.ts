import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/common/role/roles.enum';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateRatingInput } from './dto/create-rating.input';
import { DeleteRatingInput } from './dto/delete-rating.input';
import { GetRatingArgs } from './dto/get-rating.args';
import { UpdateRatingInput } from './dto/update-rating.input';
import { Rating } from './entities/rating.entity';
import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';

const ratingMock: Rating = {
  id: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  score: 75,
  comment: 'Mock rating comment',
  meta: '',
  teacher: {} as Teacher,
  university: {} as University,
};

const userMock: User = {
  id: 0,
  email: 'mockuser@example.com',
  role: Role.STUDENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  ratings: [ratingMock],
};

const ratingServiceMock = {
  findMany: jest.fn((): Rating[] => [ratingMock]),
  findOne: jest.fn((): Rating => ratingMock),
  create: jest.fn((): Rating => ratingMock),
  update: jest.fn((): Rating => ratingMock),
  delete: jest.fn((): Rating => ratingMock),
};

describe('RatingResolver', () => {
  let ratingResolver: RatingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingResolver,
        {
          provide: RatingService,
          useValue: ratingServiceMock,
        },
        PrismaModule,
      ],
      imports: [PrismaModule],
    }).compile();

    ratingResolver = module.get<RatingResolver>(RatingResolver);
  });

  it('should be defined', () => {
    expect(ratingResolver).toBeDefined();
  });

  describe('find', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: GetRatingArgs = {
        id: -1,
        page: 0,
        pageSize: 10,
      };

      const result = ratingResolver.find(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return an array of ratings if id is undefined', () => {
      const args: GetRatingArgs = {
        page: 0,
        pageSize: 10,
      };

      const result = ratingResolver.find(args);
      expect(result).resolves.toEqual([ratingMock]);
    });

    it('should return an array of single rating if id is defined', () => {
      const args: GetRatingArgs = {
        id: 0,
        page: 0,
        pageSize: 10,
      };

      const result = ratingResolver.find(args);
      expect(result).resolves.toEqual([ratingMock]);
    });
  });

  describe('create', () => {
    it('should throw an error if score is less than 0', () => {
      const args: CreateRatingInput = {
        score: -1,
        teacher: {
          id: 0,
        },
      };

      const result = ratingResolver.createRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if score is greater than 100', () => {
      const args: CreateRatingInput = {
        score: 101,
        teacher: {
          id: 0,
        },
      };

      const result = ratingResolver.createRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if university and teacher args are null', () => {
      const args: CreateRatingInput = {
        score: 75,
      };

      const result = ratingResolver.createRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return created rating if everything is okay', () => {
      const args: CreateRatingInput = {
        score: 75,
        teacher: {
          id: 0,
        },
      };

      const result = ratingResolver.createRating(userMock, args);
      expect(result).resolves.toEqual(ratingMock);
    });
  });

  describe('update', () => {
    it('should throw an error if filter id is less than zero', () => {
      const args: UpdateRatingInput = {
        filter: {
          id: -1,
        },
        set: {
          score: 75,
        },
      };

      const result = ratingResolver.updateRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if set score is less than zero', () => {
      const args: UpdateRatingInput = {
        filter: {
          id: 0,
        },
        set: {
          score: -1,
        },
      };

      const result = ratingResolver.updateRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if set arguments are null', () => {
      const args: UpdateRatingInput = {
        filter: {
          id: 0,
        },
        set: {},
      };

      const result = ratingResolver.updateRating(userMock, args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return updated rating if everything is okay', () => {
      const args: UpdateRatingInput = {
        filter: {
          id: 0,
        },
        set: {
          score: 75,
        },
      };

      const result = ratingResolver.updateRating(userMock, args);
      expect(result).resolves.toEqual(ratingMock);
    });
  });

  describe('delete', () => {
    it('should throw an error if id is less than zero', () => {
      const args: DeleteRatingInput = {
        id: -1,
      };

      const result = ratingResolver.deleteRating(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should deleted rating if everything is okay', () => {
      const args: DeleteRatingInput = {
        id: 0,
      };

      const result = ratingResolver.deleteRating(args);
      expect(result).resolves.toEqual(ratingMock);
    });
  });
});
