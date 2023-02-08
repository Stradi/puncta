import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import {
  UniversityAlreadyExistsError,
  UniversityNotFoundError,
} from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { slugify } from 'src/shared/utils/text.util';
import { GetTeacherArgs } from 'src/teacher/dto/get-teacher.args';
import { CreateUniversityInput } from './dto/create-university.input';
import { DeleteUniversityInput } from './dto/delete-university.input';
import { GetUniversityArgs } from './dto/get-university.args';
import { UpdateUniversityInput } from './dto/update-university.input';

@Injectable()
export class UniversityService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetUniversityArgs) {
    return await this.prismaService.university.findMany({
      where: {
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args.filter || {}),
      },
      take: args.pageSize,
      skip: args.page * args.pageSize,
      include: {
        faculties: true,
        teachers: true,
        ratings: true,
      },
    });
  }

  async faculties(id: number, args: GetFacultyArgs) {
    return await this.prismaService.faculty.findMany({
      where: {
        universities: {
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

  async teachers(id: number, args: GetTeacherArgs) {
    return await this.prismaService.teacher.findMany({
      where: {
        universityId: id,
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args.filter || {}),
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

  async ratings(id: number, args: GetRatingArgs) {
    return await this.prismaService.rating.findMany({
      where: {
        universityId: id,
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

  async create(args: CreateUniversityInput) {
    try {
      const university = await this.prismaService.university.create({
        data: {
          name: args.name,
          slug: slugify(args.name),
        },
        include: {
          faculties: true,
          teachers: true,
          ratings: true,
        },
      });

      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw UniversityAlreadyExistsError;
        }
      }

      throw error;
    }
  }

  async update(args: UpdateUniversityInput) {
    const setOptions: any = {};

    if (args.set.name) {
      setOptions['name'] = args.set.name;

      // We should change slug if name changes
      if (!args.set.slug) {
        setOptions['slug'] = slugify(args.set.name);
      }
    }

    if (args.set.slug) {
      setOptions['slug'] = args.set.slug;
    }

    try {
      const university = await this.prismaService.university.update({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args.filter),
        data: {
          ...setOptions,
        },
        include: {
          faculties: true,
          teachers: true,
          ratings: true,
        },
      });

      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw UniversityNotFoundError;
        }
      }

      throw error;
    }
  }

  async delete(args: DeleteUniversityInput) {
    try {
      const university = await this.prismaService.university.delete({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args),
        include: {
          faculties: true,
          teachers: true,
          ratings: true,
        },
      });

      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw UniversityNotFoundError;
        }
      }

      throw error;
    }
  }
}
