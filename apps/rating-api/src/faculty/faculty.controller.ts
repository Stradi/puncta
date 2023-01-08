import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyService } from './faculty.service';

@Controller()
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Get('faculties')
  getAllFaculties() {
    return this.facultyService.getAllFaculties();
  }

  @Get('faculties/:slug')
  getFacultyBySlug(@Param('slug') slug: string) {
    return this.facultyService.getFacultyBySlug(slug);
  }

  @Get('universities/:slug/faculties/:facultySlug')
  getFacultyOfUniversityBySlug(@Param('slug') slug: string, @Param('facultySlug') facultySlug: string) {
    return this.facultyService.getFacultyOfUniversityBySlug(slug, facultySlug);
  }

  @Get('universities/:slug/faculties')
  getAllFacultiesOfUniversity(@Param('slug') slug: string) {
    return this.facultyService.getAllFacultiesOfUniversity(slug);
  }

  @Post('universities/:slug/faculties')
  createFacultyOfUniversity(@Param('slug') slug: string, @Body() dto: CreateFacultyDto) {
    return this.facultyService.createFacultyOfUniversity(slug, dto);
  }

  @Post('faculties')
  createFaculty(@Body() dto: CreateFacultyDto) {
    return this.facultyService.createFaculty(dto);
  }

  @Patch('faculties/:slug')
  updateFaculty(@Param('slug') slug: string, @Body() dto: UpdateFacultyDto) {
    return this.facultyService.updateFaculty(slug, dto);
  }

  @Delete('universities/:slug/faculties/:facultySlug')
  deleteFacultyOfUniversity(@Param('slug') slug: string, @Param('facultySlug') facultySlug: string) {
    return this.facultyService.deleteFacultyOfUniversity(slug, facultySlug);
  }

  @Delete('faculties/:slug')
  deleteFaculty(@Param('slug') slug: string) {
    return this.facultyService.deleteFaculty(slug);
  }
}
