import { Injectable } from '@nestjs/common';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
}
