import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacultyNotFoundError } from 'src/shared/shared.exceptions';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { DeleteFacultyInput } from './dto/delete-faculty.input';
import { GetFacultyArgs } from './dto/get-faculty.args';
import { UpdateFacultyInput } from './dto/update-faculty.input';

@Injectable()
export class FacultyService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetFacultyArgs) {
    return await this.prismaService.faculty.findMany({
      take: args.pageSize,
      skip: args.page * args.pageSize,
      include: {
        universities: true,
        teachers: true,
      },
    });
  }

  async findOne(args: GetFacultyArgs) {
    let faculty = null;
    faculty = await this.prismaService.faculty.findUnique({
      where: convertArgsToWhereClause(['id', 'slug', 'name'], args),
      include: {
        universities: true,
        teachers: true,
      },
    });

    if (!faculty) {
      throw FacultyNotFoundError;
    }

    return faculty;
  }

  async create(args: CreateFacultyInput) {
    try {
      const faculty = await this.prismaService.faculty.create({
        data: {
          name: args.name,
          slug: slugify(args.name, { lower: true }),
          universities: {
            connect: convertArgsToWhereClause(['id', 'slug', 'name'], args.university),
          },
        },
        include: {
          universities: true,
          teachers: true,
        },
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
        include: {
          universities: true,
          teachers: true,
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
        include: {
          universities: true,
          teachers: true,
        },
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