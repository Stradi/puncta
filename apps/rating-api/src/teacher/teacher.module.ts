import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';

@Module({
  providers: [TeacherResolver, TeacherService, PrismaModule],
  imports: [PrismaModule],
})
export class TeacherModule {}
