import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import slugify from 'slugify';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { TeacherNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { DeleteTeacherInput } from './dto/delete-teacher.input';
import { GetTeacherArgs } from './dto/get-teacher.args';
import { UpdateTeacherInput } from './dto/update-teacher.input';

@Injectable()
export class TeacherService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetTeacherArgs) {
    const universityFilter = convertArgsToWhereClause(
      ['id', 'name', 'slug'],
      args.filter?.university || {},
    );

    const facultyFilter = convertArgsToWhereClause(
      ['id', 'name', 'slug'],
      args.filter?.faculty || {},
    );

    return await this.prismaService.teacher.findMany({
      where: {
        university: universityFilter,
        faculty: facultyFilter,
        ...convertArgsToWhereClause(['id', 'name', 'slug'], args.filter || {}),
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
      include: {
        university: true,
        faculty: true,
        ratings: true,
      },
    });
  }

  async university(id: number, args: GetUniversityArgs) {
    return await this.prismaService.university.findFirst({
      where: {
        teachers: {
          some: {
            id,
          },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args.filter || {}),
      },
      include: {
        faculties: true,
        teachers: true,
        ratings: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async faculty(id: number, args: GetFacultyArgs) {
    return await this.prismaService.faculty.findFirst({
      where: {
        teachers: {
          some: {
            id,
          },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args.filter || {}),
      },
      include: {
        universities: true,
        teachers: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async ratings(id: number, args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      where: {
        teacherId: id,
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        university: true,
        teacher: true,
        user: true,
        response: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async create(args: CreateTeacherInput) {
    try {
      const teacher = await this.prismaService.teacher.create({
        data: {
          name: args.name,
          slug: slugify(args.name, { lower: true }),
          university: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.university,
            ),
          },
          faculty: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.faculty,
            ),
          },
        },
        include: {
          university: true,
          faculty: true,
          ratings: true,
        },
      });

      return teacher;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // If university nor faculty could not be created then we should throw
          // University/Faculty not found error. But currently we are throwing
          // TeacherNotFoundError. Prisma should give more information about
          // errors.
          // Same thing goes for `update` function in this class. (If someone)
          // tries to update a teacher's university or faculty to something
          // that doesn't exists, it still throws TeacherNotFoundError.
          throw TeacherNotFoundError;
        }
      }

      throw error;
    }
  }

  async update(args: UpdateTeacherInput) {
    const setOptions: any = {};

    if (args.set.name) {
      setOptions['name'] = args.set.name;

      // We should change slug if name changes
      if (!args.set.slug) {
        setOptions['slug'] = slugify(args.set.name, { lower: true });
      }
    }

    if (args.set.slug) {
      setOptions['slug'] = args.set.slug;
    }

    if (args.set.university) {
      setOptions['university'] = {
        connect: convertArgsToWhereClause(
          ['id', 'slug', 'name'],
          args.set.university,
        ),
      };
    }

    if (args.set.faculty) {
      setOptions['faculty'] = {
        connect: convertArgsToWhereClause(
          ['id', 'slug', 'name'],
          args.set.faculty,
        ),
      };
    }

    try {
      const teacher = await this.prismaService.teacher.update({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args.filter),
        data: {
          ...setOptions,
        },
        include: {
          university: true,
          faculty: true,
          ratings: true,
        },
      });

      return teacher;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw TeacherNotFoundError;
        }
      }

      throw error;
    }
  }

  async delete(args: DeleteTeacherInput) {
    try {
      const teacher = await this.prismaService.teacher.delete({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args),
        include: {
          university: true,
          faculty: true,
          ratings: true,
        },
      });

      return teacher;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw TeacherNotFoundError;
        }
      }

      throw error;
    }
  }
}
