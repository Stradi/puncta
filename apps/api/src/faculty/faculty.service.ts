import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FacultyAlreadyExistsError,
  FacultyNotFoundError,
} from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { GetTeacherArgs } from 'src/teacher/dto/get-teacher.args';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { DeleteFacultyInput } from './dto/delete-faculty.input';
import { GetFacultyArgs } from './dto/get-faculty.args';
import { UpdateFacultyInput } from './dto/update-faculty.input';

@Injectable()
export class FacultyService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetFacultyArgs) {
    const universityFilter = convertArgsToWhereClause(
      ['id', 'name', 'slug'],
      args.filter?.university || {},
    );

    const facultySort = convertArgsToWhereClause(
      ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
      args.sort || {},
    );

    return await this.prismaService.faculty.findMany({
      where: {
        universities: {
          some: universityFilter,
        },
        ...convertArgsToWhereClause(['id', 'name', 'slug'], args.filter || {}),
      },
      orderBy: facultySort,
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });
  }

  async teachers(id: number, args: GetTeacherArgs) {
    return await this.prismaService.faculty
      .findUnique({
        where: { id },
      })
      .teachers({
        where: {
          ...convertArgsToWhereClause(
            ['id', 'slug', 'name'],
            args.filter || {},
          ),
        },
        orderBy: convertArgsToWhereClause(
          ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
          args.sort || {},
        ),
        take: args.pageSize,
        skip: args.page * args.pageSize,
      });
  }

  async universities(id: number, args: GetUniversityArgs) {
    return await this.prismaService.faculty
      .findUnique({
        where: { id },
      })
      .universities({
        where: {
          ...convertArgsToWhereClause(
            ['id', 'slug', 'name'],
            args.filter || {},
          ),
        },
        orderBy: convertArgsToWhereClause(
          ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
          args.sort || {},
        ),
        take: args.pageSize,
        skip: args.page * args.pageSize,
      });
  }

  async create(args: CreateFacultyInput) {
    try {
      const faculty = await this.prismaService.faculty.upsert({
        where: {
          name: args.name,
        },
        update: {
          universities: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.university,
            ),
          },
        },
        create: {
          name: args.name,
          slug: slugify(args.name, { lower: true }),
          universities: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.university,
            ),
          },
        },
      });

      return faculty;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw FacultyNotFoundError;
        } else if (error.code === 'P2002') {
          throw FacultyAlreadyExistsError;
        }
      }

      throw error;
    }
  }

  async update(args: UpdateFacultyInput) {
    const setOptions: any = {};

    if (args.set.name) {
      setOptions['name'] = args.set.name;

      if (!args.set.slug) {
        setOptions['slug'] = slugify(args.set.name, { lower: true });
      }
    }

    if (args.set.slug) {
      setOptions['slug'] = args.set.slug;
    }

    try {
      const university = await this.prismaService.faculty.update({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args.filter),
        data: {
          ...setOptions,
        },
      });

      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw FacultyNotFoundError;
        }
      }

      throw error;
    }
  }

  async delete(args: DeleteFacultyInput) {
    try {
      const faculty = await this.prismaService.faculty.delete({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args),
      });

      return faculty;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw FacultyNotFoundError;
        }
      }

      throw error;
    }
  }
}
