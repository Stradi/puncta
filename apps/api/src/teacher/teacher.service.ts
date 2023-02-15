import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { TeacherNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
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

    const teacherSort = convertArgsToWhereClause(
      ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
      args.sort || {},
    );

    return await this.prismaService.teacher.findMany({
      where: {
        university: universityFilter,
        faculty: facultyFilter,
        ...convertArgsToWhereClause(['id', 'name', 'slug'], args.filter || {}),
      },
      orderBy: teacherSort,
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async university(id: number) {
    return await this.prismaService.teacher
      .findUnique({
        where: { id },
      })
      .university();
  }

  async faculty(id: number) {
    return await this.prismaService.teacher
      .findUnique({
        where: { id },
      })
      .faculty();
  }

  async ratings(id: number, args: GetRatingArgs) {
    return await this.prismaService.teacher
      .findUnique({
        where: {
          id,
        },
      })
      .ratings({
        where: {
          ...convertArgsToWhereClause(['id', 'slug', 'name'], args || {}),
        },
        orderBy: convertArgsToWhereClause(
          ['id', 'createdAt', 'updatedAt'],
          args.sort || {},
        ),
        take: args.pageSize,
        skip: args.page * args.pageSize,
      });
  }

  async ratingCount(id: number) {
    return await this.prismaService.rating.count({
      where: {
        teacher: { id },
      },
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
