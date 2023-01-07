import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversityService {
  constructor(private prismaService: PrismaService) {}
  async getAllUniversities() {
    return await this.prismaService.university.findMany();
  }

  async getUniversityBySlug(slug: string) {
    const university = await this.prismaService.university.findUnique({
      where: {
        slug,
      },
    });

    if (!university) {
      throw new NotFoundException('University not found.', 'UNIVERSITY_NOT_FOUND');
    }

    return university;
  }

  async createUniversity(dto: CreateUniversityDto) {
    // TODO: Use a slugify library.
    const slug = dto.name.toLowerCase().replace(' ', '-');

    let university = null;
    try {
      university = await this.prismaService.university.create({
        data: {
          name: dto.name,
          slug,
        },
      });
    } catch (error) {
      // If university already exists, then throw a custom error.
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('University already exists.', 'UNIVERSITY_ALREADY_EXISTS');
        }
      }

      // Otherwise, throw the original error.
      throw error;
    }

    if (!university) {
      throw new BadRequestException('University could not be created.', 'UNIVERSITY_NOT_CREATED');
    }

    return university;
  }

  async updateUniversity(slug: string, dto: UpdateUniversityDto) {
    let university = null;

    try {
      university = await this.prismaService.university.update({
        where: {
          slug,
        },
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('University not found.', 'UNIVERSITY_NOT_FOUND');
        }
      }

      throw error;
    }

    return university;
  }

  async deleteUniversity(slug: string) {
    let university = null;

    try {
      university = await this.prismaService.university.delete({
        where: {
          slug,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('University not found.', 'UNIVERSITY_NOT_FOUND');
        }
      }

      throw error;
    }

    return university;
  }
}
