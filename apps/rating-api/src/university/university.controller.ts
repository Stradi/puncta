import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UniversityService } from './university.service';

@Controller('universities')
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Get()
  getAllUniversities() {
    return this.universityService.getAllUniversities();
  }

  @Get(':slug')
  getUniversityBySlug(@Param('slug') slug: string) {
    return this.universityService.getUniversityBySlug(slug);
  }

  @Post()
  createUniversity(@Body() dto: CreateUniversityDto) {
    return this.universityService.createUniversity(dto);
  }

  @Patch(':slug')
  updateUniversity(@Param('slug') slug: string, @Body() dto: UpdateUniversityDto) {
    return this.universityService.updateUniversity(slug, dto);
  }

  @Delete(':slug')
  deleteUniversity(@Param('slug') slug: string) {
    return this.universityService.deleteUniversity(slug);
  }
}
