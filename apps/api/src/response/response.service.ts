import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import {
  RatingNotFoundError,
  ResponseNotFoundError,
} from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { User } from 'src/user/entities/user.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { DeleteResponseInput } from './dto/delete-response.input';
import { GetResponseArgs } from './dto/get-response.args';
import { UpdateResponseInput } from './dto/update-response.input';

@Injectable()
export class ResponseService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetResponseArgs) {
    return await this.prismaService.response.findMany({
      take: args.pageSize,
      skip: args.page * args.pageSize,
      include: {
        from: true,
        to: true,
      },
    });
  }

  async findOne(args: GetResponseArgs) {
    let response = null;
    response = await this.prismaService.response.findUnique({
      where: {
        id: args.id,
      },
      include: {
        from: true,
        to: true,
      },
    });

    if (!response) {
      throw ResponseNotFoundError;
    }

    return response;
  }

  async to(id: number, args: GetRatingArgs) {
    return await this.prismaService.rating.findFirst({
      where: {
        response: {
          id,
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        university: true,
        teacher: true,
        response: true,
      },
    });
  }

  async from(id: number) {
    return await this.prismaService.user.findFirst({
      where: {
        responses: {
          some: { id },
        },
      },
      // We don't need university, faculty or rating fields since
      // this user is teacher (students can't create responses).
      include: {
        responses: true,
        teacher: true,
      },
    });
  }

  async create(args: CreateResponseInput, user: User) {
    try {
      if (!(await this.isRatingBelongsToTeacher(args.to, user.teacher.id))) {
        throw new ForbiddenException(
          "You can't create response for this rating",
        );
      }

      const response = await this.prismaService.response.create({
        data: {
          content: args.content,
          meta: args.meta,
          from: {
            connect: {
              id: user.id,
            },
          },
          to: {
            connect: {
              id: args.to,
            },
          },
        },
        include: {
          from: true,
          to: true,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw RatingNotFoundError;
        }
      }
      throw error;
    }
  }

  async update(args: UpdateResponseInput) {
    const setOptions: any = {};

    if (args.set.content) {
      setOptions['content'] = args.set.content;
    }

    if (args.set.meta) {
      setOptions['meta'] = args.set.meta;
    }

    try {
      const response = await this.prismaService.response.update({
        where: {
          id: args.filter.id,
        },
        data: {
          ...setOptions,
        },
        include: {
          from: true,
          to: true,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw ResponseNotFoundError;
        }
      }

      throw error;
    }
  }

  async delete(args: DeleteResponseInput) {
    try {
      const response = await this.prismaService.response.delete({
        where: { id: args.id },
        include: {
          from: true,
          to: true,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw ResponseNotFoundError;
        }
      }

      throw error;
    }
  }

  private async isRatingBelongsToTeacher(ratingId: number, teacherId: number) {
    const rating = await this.prismaService.rating.findFirst({
      where: {
        id: ratingId,
        teacher: {
          id: teacherId,
        },
      },
    });

    return !!rating;
  }
}
