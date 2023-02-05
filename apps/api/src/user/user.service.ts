import { Injectable } from '@nestjs/common';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { GetResponseArgs } from 'src/response/dto/get-response.args';
import { UserNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';
import { GetUserArgs } from './dto/get-user.args';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async find(args: GetUserArgs) {
    let user = null;
    user = await this.prismaService.user.findUnique({
      where: {
        username: args.username,
      },
      include: {
        university: true,
        faculty: true,
        ratings: true,
        responses: true,
        teacher: true,
      },
    });

    if (!user) {
      throw UserNotFoundError;
    }

    return user;
  }

  async ratings(id: number, args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      where: {
        user: {
          id,
        },
        id: args.id,
      },
      include: {
        university: true,
        teacher: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async university(id: number, args: GetUniversityArgs) {
    return await this.prismaService.university.findFirst({
      where: {
        users: {
          some: {
            id,
          },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        faculties: true,
        ratings: true,
        teachers: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async faculty(id: number, args: GetFacultyArgs) {
    return await this.prismaService.faculty.findFirst({
      where: {
        users: {
          some: {
            id,
          },
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        universities: true,
        teachers: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async response(id: number, args: GetResponseArgs) {
    return await this.prismaService.response.findMany({
      where: {
        from: {
          id,
        },
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args),
      },
      include: {
        from: true,
        to: true,
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }
}
