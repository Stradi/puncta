import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { GetTeacherArgs } from 'src/teacher/dto/get-teacher.args';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';
import { User } from 'src/user/entities/user.entity';
import { CreateRatingInput } from './dto/create-rating.input';
import { DeleteRatingInput } from './dto/delete-rating.input';
import { GetRatingArgs } from './dto/get-rating.args';
import { UpdateRatingInput } from './dto/update-rating.input';

@Injectable()
export class RatingService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      take: args.pageSize,
      skip: args.page * args.pageSize,
      include: {
        university: true,
        teacher: true,
      },
    });
  }

  async findOne(args: GetRatingArgs) {
    let rating = null;
    rating = await this.prismaService.rating.findUnique({
      where: {
        id: args.id,
      },
      include: {
        university: true,
        teacher: true,
      },
    });

    if (!rating) {
      throw RatingNotFoundError;
    }

    return rating;
  }

  async university(id: number, args: GetUniversityArgs) {
    return await this.prismaService.university.findFirst({
      where: {
        ratings: {
          some: { id },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
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

  async teacher(id: number, args: GetTeacherArgs) {
    return await this.prismaService.teacher.findFirst({
      where: {
        ratings: {
          some: { id },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        university: true,
        faculty: true,
        ratings: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async create(args: CreateRatingInput, user: User) {
    let ratingTo = {};

    // We should check if the university or teacher exists
    // Our priority is one that's more specific. In that case teacher.
    // By checking university first allows teacher to override if both
    // are passed.
    if (
      args.university &&
      (args.university.id || args.university.slug || args.university.name)
    ) {
      ratingTo = {
        university: {
          connect: convertArgsToWhereClause(
            ['id', 'slug', 'name'],
            args.university,
          ),
        },
      };
    }

    if (
      args.teacher &&
      (args.teacher.id || args.teacher.slug || args.teacher.name)
    ) {
      ratingTo = {
        teacher: {
          connect: convertArgsToWhereClause(
            ['id', 'slug', 'name'],
            args.teacher,
          ),
        },
      };
    }

    try {
      const rating = await this.prismaService.rating.create({
        data: {
          score: args.score,
          comment: args.comment || '',
          meta: args.meta || '',
          user: {
            connect: {
              id: user.id,
            },
          },
          ...ratingTo,
        },
        include: {
          university: true,
          teacher: true,
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw RatingNotFoundError;
        }
      }

      throw error;
    }
  }

  async update(args: UpdateRatingInput) {
    const setOptions: any = {};

    if (args.set.score) {
      setOptions['score'] = args.set.score;
    }

    if (args.set.comment) {
      setOptions['comment'] = args.set.comment;
    }

    if (args.set.meta) {
      setOptions['meta'] = args.set.meta;
    }

    try {
      const rating = await this.prismaService.rating.update({
        where: {
          id: args.filter.id,
        },
        data: {
          ...setOptions,
        },
        include: {
          university: true,
          teacher: true,
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw RatingNotFoundError;
        }
      }

      throw error;
    }
  }

  async delete(args: DeleteRatingInput) {
    try {
      const rating = await this.prismaService.rating.delete({
        where: { id: args.id },
        include: {
          university: true,
          teacher: true,
        },
      });

      return rating;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw RatingNotFoundError;
        }
      }

      throw error;
    }
  }
}
