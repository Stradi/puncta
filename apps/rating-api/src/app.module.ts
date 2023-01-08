import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacultyModule } from './faculty/faculty.module';
import { PrismaModule } from './prisma/prisma.module';
import { UniversityModule } from './university/university.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UniversityModule,
    FacultyModule,
  ],
})
export class AppModule {}
