import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { DeleteFacultyInput } from './dto/delete-faculty.input';
import { GetFacultyArgs } from './dto/get-faculty.args';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { Faculty } from './entities/faculty.entity';
import { FacultyResolver } from './faculty.resolver';
import { FacultyService } from './faculty.service';

const facultyMock: Faculty = {
  id: 0,
  name: 'Mock Faculty',
  slug: 'mock-faculty',
  createdAt: new Date(),
  updatedAt: new Date(),
  universities: [{}] as [University],
  teachers: [{}] as [Teacher],
};

const facultyServiceMock = {
  findMany: jest.fn((): Faculty[] => [facultyMock]),
  findOne: jest.fn((): Faculty => facultyMock),
  create: jest.fn((): Faculty => facultyMock),
  update: jest.fn((): Faculty => facultyMock),
  delete: jest.fn((): Faculty => facultyMock),
};

describe('FacultyResolver', () => {
  let facultyResolver: FacultyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacultyResolver,
        {
          provide: FacultyService,
          useValue: facultyServiceMock,
        },
        PrismaModule,
      ],
      imports: [PrismaModule],
    }).compile();

    facultyResolver = module.get<FacultyResolver>(FacultyResolver);
  });

  it('should be defined', () => {
    expect(facultyResolver).toBeDefined();
  });

  describe('find', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: GetFacultyArgs = {
        id: -1,
        page: 0,
        pageSize: 10,
      };

      const result = facultyResolver.find(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return array of faculties when arguments are null', () => {
      const args: GetFacultyArgs = {
        page: 0,
        pageSize: 10,
      };

      const result = facultyResolver.find(args);
      expect(result).resolves.toEqual([facultyMock]);
    });

    it('should return array with single faculty if arguments provided', () => {
      const args: GetFacultyArgs = {
        id: 1,
        page: 0,
        pageSize: 10,
      };

      const result = facultyResolver.find(args);
      expect(result).resolves.toEqual([facultyMock]);
    });
  });

  describe('create', () => {
    it('should throw an error if university arguments are null', () => {
      const args: CreateFacultyInput = {
        name: 'New Mock Faculty Name',
        university: {},
      };

      const result = facultyResolver.createFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return newly created faculty if everything is okay', () => {
      const args: CreateFacultyInput = {
        name: 'New Mock Faculty Name',
        university: {
          id: 1,
        },
      };

      const result = facultyResolver.createFaculty(args);
      expect(result).resolves.toEqual(facultyMock);
    });
  });

  describe('update', () => {
    it('should throw an error if id argument of filter is invalid', () => {
      const args: UpdateFacultyInput = {
        filter: {
          id: -1,
        },
        set: {
          name: 'New Mock Faculty Name',
        },
      };

      const result = facultyResolver.updateFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if arguments are null', () => {
      const args: UpdateFacultyInput = {
        filter: {},
        set: {
          name: 'New Mock Faculty Name',
        },
      };

      const result = facultyResolver.updateFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if set arguments are null', () => {
      const args: UpdateFacultyInput = {
        filter: {
          id: 0,
        },
        set: {},
      };

      const result = facultyResolver.updateFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return updated faculty if everything is okay', () => {
      const args: UpdateFacultyInput = {
        filter: {
          id: 0,
        },
        set: {
          name: 'New Mock Faculty Name',
        },
      };

      const result = facultyResolver.updateFaculty(args);
      expect(result).resolves.toEqual(facultyMock);
    });
  });

  describe('delete', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: DeleteFacultyInput = {
        id: -1,
      };

      const result = facultyResolver.deleteFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if arguments are null', () => {
      const args: DeleteFacultyInput = {};

      const result = facultyResolver.deleteFaculty(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return deleted faculty if everything is okay', () => {
      const args: DeleteFacultyInput = {
        id: 0,
      };

      const result = facultyResolver.deleteFaculty(args);
      expect(result).resolves.toEqual(facultyMock);
    });
  });
});
