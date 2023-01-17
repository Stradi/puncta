import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniversityResolver } from './university.resolver';
import { UniversityService } from './university.service';

@Module({
  providers: [UniversityResolver, UniversityService, PrismaModule],
  imports: [PrismaModule],
})
export class UniversityModule {}
