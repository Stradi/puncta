import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private prismaService: PrismaService) {}

  getAllFaculties() {
    return this.prismaService.faculty.findMany();
  }

  async getFacultyBySlug(slug: string) {
    const faculty = await this.prismaService.faculty.findFirst({
      where: {
        slug,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.', 'FACULTY_NOT_FOUND');
    }
    return faculty;
  }

  async getFacultyOfUniversityBySlug(slug: string, facultySlug: string) {
    const faculty = await this.prismaService.faculty.findFirst({
      where: {
        slug: facultySlug,
        universities: {
          some: {
            slug,
          },
        },
      },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.', 'FACULTY_NOT_FOUND');
    }

    return faculty;
  }

  async getAllFacultiesOfUniversity(slug: string) {
    const faculties = await this.prismaService.faculty.findMany({
      where: {
        universities: {
          some: {
            slug,
          },
        },
      },
    });

    if (!faculties) {
      throw new NotFoundException('Faculties not found.', 'FACULTIES_NOT_FOUND');
    }

    return faculties;
  }

  async createFacultyOfUniversity(slug: string, dto: CreateFacultyDto) {
    const facultySlug = dto.name.toLocaleLowerCase().replace(' ', '-');

    let faculty = null;
    try {
      faculty = await this.prismaService.university.update({
        where: {
          slug,
        },
        data: {
          faculties: {
            connectOrCreate: {
              where: {
                slug: facultySlug,
              },
              create: {
                name: dto.name,
                slug: facultySlug,
              },
            },
          },
        },
        include: {
          faculties: true,
        },
      });
    } catch (error) {
      // Currently it doesn't throw an error if the faculty already exists.
      // We should fix this..
    }

    if (!faculty) {
      throw new BadRequestException('Faculty could not be created.', 'FACULTY_NOT_CREATED');
    }

    return faculty;
  }

  async createFaculty(dto: CreateFacultyDto) {
    const slug = dto.name.toLocaleLowerCase().replace(' ', '-');

    let faculty = null;
    try {
      faculty = await this.prismaService.faculty.create({
        data: {
          name: dto.name,
          slug,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Faculty already exists.', 'FACULTY_ALREADY_EXISTS');
        }
      }
    }

    if (!faculty) {
      throw new BadRequestException('Faculty could not be created.', 'FACULTY_NOT_CREATED');
    }

    return faculty;
  }

  async updateFaculty(slug: string, dto: UpdateFacultyDto) {
    const faculty = await this.prismaService.faculty.update({
      where: {
        slug,
      },
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.', 'FACULTY_NOT_FOUND');
    }

    return faculty;
  }

  async deleteFacultyOfUniversity(slug: string, facultySlug: string) {
    const faculty = await this.prismaService.faculty.delete({
      where: {
        slug: facultySlug,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.', 'FACULTY_NOT_FOUND');
    }

    return faculty;
  }

  async deleteFaculty(slug: string) {
    let faculty = null;

    try {
      faculty = await this.prismaService.faculty.delete({
        where: {
          slug,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Faculty not found.', 'FACULTY_NOT_FOUND');
        }
      }
    }

    return faculty;
  }
}
