import { Test, TestingModule } from '@nestjs/testing';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Rating } from 'src/rating/entities/rating.entity';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { CreateUniversityInput } from './dto/create-university.input';
import { DeleteUniversityInput } from './dto/delete-university.input';
import { GetUniversityArgs } from './dto/get-university.args';
import { UpdateUniversityInput } from './dto/update-university.input';
import { University } from './entities/university.entity';
import { UniversityResolver } from './university.resolver';
import { UniversityService } from './university.service';

const universityMock: University = {
  id: 0,
  name: 'Mock University',
  slug: 'mock-university',
  createdAt: new Date(),
  updatedAt: new Date(),
  faculties: [{}] as [Faculty],
  teachers: [{}] as [Teacher],
  ratings: [{}] as [Rating],
};

const universityServiceMock = {
  findMany: jest.fn((): University[] => [universityMock]),
  findOne: jest.fn((): University => universityMock),
  create: jest.fn((): University => universityMock),
  update: jest.fn((): University => universityMock),
  delete: jest.fn((): University => universityMock),
};

describe('UniversityResolver', () => {
  let universityResolver: UniversityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityResolver,
        {
          provide: UniversityService,
          useValue: universityServiceMock,
        },
        PrismaModule,
      ],
      imports: [PrismaModule],
    }).compile();

    universityResolver = module.get<UniversityResolver>(UniversityResolver);
  });

  it('should be defined', () => {
    expect(universityResolver).toBeDefined();
  });

  describe('find', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: GetUniversityArgs = {
        id: -1,
        page: 0,
        pageSize: 10,
      };

      const result = universityResolver.find(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return array of universities when arguments are empty', () => {
      const args: GetUniversityArgs = {
        page: 0,
        pageSize: 10,
      };

      const result = universityResolver.find(args);
      expect(result).resolves.toEqual([universityMock]);
    });

    it('should return array of single university if arguments provided', () => {
      const args: GetUniversityArgs = {
        id: 0,
        page: 0,
        pageSize: 10,
      };

      const result = universityResolver.find(args);
      expect(result).resolves.toEqual([universityMock]);
    });
  });

  describe('create', () => {
    it('should create and return an university', () => {
      const args: CreateUniversityInput = {
        name: 'Mock University',
      };

      const result = universityResolver.createUniversity(args);
      expect(result).resolves.toEqual(universityMock);
    });
  });

  describe('update', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: UpdateUniversityInput = {
        filter: {
          id: -1,
        },
        set: {
          name: 'New Mock University Name',
        },
      };

      const result = universityResolver.updateUniversity(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if filter arguments are null', () => {
      const args: UpdateUniversityInput = {
        filter: {},
        set: {
          name: 'New Mock University Name',
        },
      };

      const result = universityResolver.updateUniversity(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if set arguments are null', () => {
      const args: UpdateUniversityInput = {
        filter: {
          id: 0,
        },
        set: {},
      };

      const result = universityResolver.updateUniversity(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should update university if everthing is okay', () => {
      const args: UpdateUniversityInput = {
        filter: {
          id: 0,
        },
        set: {
          name: 'New Mock University Name',
        },
      };

      const result = universityResolver.updateUniversity(args);
      expect(result).resolves.toEqual(universityMock);
    });
  });

  describe('delete', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: DeleteUniversityInput = {
        id: -1,
      };

      const result = universityResolver.deleteUniversity(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if arguments are null', () => {
      const args: DeleteUniversityInput = {};

      const result = universityResolver.deleteUniversity(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return deleted university if everything is okay', () => {
      const args: DeleteUniversityInput = {
        id: 0,
      };

      const result = universityResolver.deleteUniversity(args);
      expect(result).resolves.toEqual(universityMock);
    });
  });
});
