import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { RevalidateService } from 'src/revalidate/revalidate.service';
import { RatingNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { User } from 'src/user/entities/user.entity';
import { CreateRatingInput } from './dto/create-rating.input';
import { DeleteRatingInput } from './dto/delete-rating.input';
import { GetRatingArgs } from './dto/get-rating.args';
import { UpdateRatingInput } from './dto/update-rating.input';

@Injectable()
export class RatingService {
  constructor(
    private prismaService: PrismaService,
    private revalidateService: RevalidateService,
  ) {}

  async findMany(args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      orderBy: convertArgsToWhereClause(
        ['id', 'createdAt', 'updatedAt'],
        args.sort || {},
      ),
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async findOne(args: GetRatingArgs) {
    let rating = null;
    rating = await this.prismaService.rating.findUnique({
      where: {
        id: args.id,
      },
    });

    if (!rating) {
      throw RatingNotFoundError;
    }

    return rating;
  }

  async university(id: number) {
    return await this.prismaService.rating
      .findUnique({
        where: { id },
      })
      .university();
  }

  async teacher(id: number) {
    return await this.prismaService.rating
      .findUnique({
        where: { id },
      })
      .teacher();
  }

  async user(id: number) {
    return await this.prismaService.rating
      .findUnique({
        where: { id },
      })
      .user();
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
          teacher: true,
          university: true,
        },
      });

      // Looks like we should wait for the revalidation to finish. This causes
      // the request to take longer but it's better than having stale data.
      if (rating.teacher && args.teacher) {
        await this.revalidateService.revalidateTeachers([rating.teacher.slug]);
      } else if (rating.university && args.university) {
        await this.revalidateService.revalidateUniversities([
          rating.university.slug,
        ]);
      }

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
          teacher: true,
          university: true,
        },
      });

      if (rating.teacher) {
        this.revalidateService.revalidateTeachers([rating.teacher.slug]);
      } else if (rating.university) {
        this.revalidateService.revalidateUniversities([rating.university.slug]);
      }

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
          teacher: true,
          university: true,
        },
      });

      if (rating.teacher) {
        await this.revalidateService.revalidateTeachers([rating.teacher.slug]);
      } else if (rating.university) {
        await this.revalidateService.revalidateUniversities([
          rating.university.slug,
        ]);
      }

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
