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
import { University } from '@prisma/client';

@Injectable()
export class UniversityService {
  constructor(private prismaService: PrismaService) {}

  async findMany(args: GetUniversityArgs) {
    const response = await this.prismaService.university.findMany({
      where: {
        ...convertArgsToWhereClause(['id', 'slug', 'name'], args.filter || {}),
      },
      orderBy: convertArgsToWhereClause(
        ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
        args.sort || {},
      ),
      take: args.pageSize,
      skip: args.page * args.pageSize,
    });

    return response.map(this.convertImageBufferToBase64);
  }

  async faculties(id: number, args: GetFacultyArgs) {
    return await this.prismaService.university
      .findUnique({
        where: { id },
      })
      .faculties({
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

  async facultyCount(id: number) {
    return await this.prismaService.faculty.count({
      where: { universities: { some: { id } } },
    });
  }

  async teachers(id: number, args: GetTeacherArgs) {
    return this.prismaService.university
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

  async teacherCount(id: number) {
    return await this.prismaService.teacher.count({
      where: { universityId: id },
    });
  }

  async ratings(id: number, args: GetRatingArgs) {
    return this.prismaService.university
      .findUnique({
        where: { id },
      })
      .ratings({
        where: {
          ...convertArgsToWhereClause(['id', 'slug', 'name'], args || {}),
        },
        orderBy: convertArgsToWhereClause(
          ['id', 'createdAt', 'updatedAt', 'name', 'slug'],
          args.sort || {},
        ),
        take: args.pageSize,
        skip: args.page * args.pageSize,
      });
  }

  async ratingCount(id: number) {
    return await this.prismaService.rating.count({
      where: { universityId: id },
    });
  }

  async create(args: CreateUniversityInput) {
    try {
      const university = await this.prismaService.university.create({
        data: {
          name: args.name,
          slug: slugify(args.name),
          domain: {
            create: {
              name: args.domain,
            },
          },
        },
      });

      return this.convertImageBufferToBase64(university);
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

    if (args.set.image) {
      setOptions['image'] = this.convertBase64ToImageBuffer(args.set.image);
    }

    try {
      const university = await this.prismaService.university.update({
        where: convertArgsToWhereClause(['id', 'slug', 'name'], args.filter),
        data: {
          ...setOptions,
        },
      });

      return this.convertImageBufferToBase64(university);
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
      });

      return this.convertImageBufferToBase64(university);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw UniversityNotFoundError;
        }
      }

      throw error;
    }
  }

  convertImageBufferToBase64(university: University) {
    if (!university.image) {
      return university;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - We should convert Buffer to Base64, but TypeScript still
    // complains about it.
    university['image'] = Buffer.from(university.image, 'base64').toString(
      'ascii',
    );

    return university;
  }

  convertBase64ToImageBuffer(base64: string) {
    return Buffer.from(base64);
  }
}
