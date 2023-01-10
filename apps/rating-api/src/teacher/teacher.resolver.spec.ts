import { Test, TestingModule } from '@nestjs/testing';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { University } from 'src/university/entities/university.entity';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { DeleteTeacherInput } from './dto/delete-teacher.input';
import { GetTeacherArgs } from './dto/get-teacher.args';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { Teacher } from './entities/teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';

const teacherMock: Teacher = {
  id: 0,
  name: 'Mock Teacher',
  slug: 'mock-teacher',
  createdAt: new Date(),
  updatedAt: new Date(),
  university: {} as University,
  faculty: {} as Faculty,
};

const teacherServiceMock = {
  findMany: jest.fn((): Teacher[] => [teacherMock]),
  findOne: jest.fn((): Teacher => teacherMock),
  create: jest.fn((): Teacher => teacherMock),
  update: jest.fn((): Teacher => teacherMock),
  delete: jest.fn((): Teacher => teacherMock),
};

describe('TeacherResolver', () => {
  let teacherResolver: TeacherResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherResolver,
        {
          provide: TeacherService,
          useValue: teacherServiceMock,
        },
        PrismaModule,
      ],
      imports: [PrismaModule],
    }).compile();

    teacherResolver = module.get<TeacherResolver>(TeacherResolver);
  });

  it('should be defined', () => {
    expect(teacherResolver).toBeDefined();
  });

  describe('find', () => {
    it('should throw an error if id is invalid', () => {
      const args: GetTeacherArgs = {
        id: -1,
        page: 0,
        pageSize: 10,
      };

      const result = teacherResolver.find(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return an array of teacher if arguments are null', () => {
      const args: GetTeacherArgs = {
        page: 0,
        pageSize: 10,
      };

      const result = teacherResolver.find(args);
      expect(result).resolves.toEqual([teacherMock]);
    });

    it('should return array with single teacher if everything is okay', () => {
      const args: GetTeacherArgs = {
        id: 0,
        page: 0,
        pageSize: 10,
      };

      const result = teacherResolver.find(args);
      expect(result).resolves.toEqual([teacherMock]);
    });
  });

  describe('create', () => {
    it('should throw an error if university arguments are null', () => {
      const args: CreateTeacherInput = {
        name: 'Mock Teacher Name',
        university: {},
        faculty: { id: 0 },
      };

      const result = teacherResolver.createTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if faculty arguments are null', () => {
      const args: CreateTeacherInput = {
        name: 'Mock Teacher Name',
        university: {
          id: 0,
        },
        faculty: {},
      };

      const result = teacherResolver.createTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return created teacher if everything is okay', () => {
      const args: CreateTeacherInput = {
        name: 'Mock Teacher Name',
        university: {
          id: 0,
        },
        faculty: { id: 0 },
      };

      const result = teacherResolver.createTeacher(args);
      expect(result).resolves.toEqual(teacherMock);
    });
  });

  describe('update', () => {
    it('should throw an error if filter id argument is invalid', () => {
      const args: UpdateTeacherInput = {
        filter: {
          id: -1,
        },
        set: {
          name: 'New Mock Teacher Name',
        },
      };

      const result = teacherResolver.updateTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if filter arguments are null', () => {
      const args: UpdateTeacherInput = {
        filter: {},
        set: {
          name: 'New Mock Teacher Name',
        },
      };

      const result = teacherResolver.updateTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if set arguments are null', () => {
      const args: UpdateTeacherInput = {
        filter: {
          id: 0,
        },
        set: {},
      };

      const result = teacherResolver.updateTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return updated teacher if everything is okay', () => {
      const args: UpdateTeacherInput = {
        filter: {
          id: 0,
        },
        set: {
          name: 'New Mock Teacher Name',
        },
      };

      const result = teacherResolver.updateTeacher(args);
      expect(result).resolves.toEqual(teacherMock);
    });
  });

  describe('delete', () => {
    it('should throw an error if id argument is invalid', () => {
      const args: DeleteTeacherInput = {
        id: -1,
      };

      const result = teacherResolver.deleteTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should throw an error if arguments are null', () => {
      const args: DeleteTeacherInput = {};

      const result = teacherResolver.deleteTeacher(args);
      expect(result).rejects.toThrow(GenericInvalidParameterError);
    });

    it('should return deleted teacher if everything is okay', () => {
      const args: DeleteTeacherInput = {
        id: 0,
      };

      const result = teacherResolver.deleteTeacher(args);
      expect(result).resolves.toEqual(teacherMock);
    });
  });
});
