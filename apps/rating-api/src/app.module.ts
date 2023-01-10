import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { FacultyModule } from './faculty/faculty.module';
import { TeacherModule } from './teacher/teacher.module';
import { UniversityModule } from './university/university.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    UniversityModule,
    FacultyModule,
    TeacherModule,
  ],
})
export class AppModule {}
