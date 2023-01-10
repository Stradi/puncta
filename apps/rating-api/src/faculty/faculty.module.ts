import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FacultyResolver } from './faculty.resolver';
import { FacultyService } from './faculty.service';

@Module({
  providers: [FacultyResolver, FacultyService, PrismaModule],
  imports: [PrismaModule],
})
export class FacultyModule {}
