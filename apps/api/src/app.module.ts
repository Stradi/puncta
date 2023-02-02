import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import config from './common/config/config';
import { FacultyModule } from './faculty/faculty.module';
import { RatingModule } from './rating/rating.module';
import { TeacherModule } from './teacher/teacher.module';
import { UniversityModule } from './university/university.module';
import { UserModule } from './user/user.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    UniversityModule,
    FacultyModule,
    TeacherModule,
    RatingModule,
    AuthModule,
    UserModule,
    ResponseModule,
  ],
})
export class AppModule {}
