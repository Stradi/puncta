import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { FacultyModule } from './faculty/faculty.module';
import { GlobalExceptionFilter } from './global-exception.filter';
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
