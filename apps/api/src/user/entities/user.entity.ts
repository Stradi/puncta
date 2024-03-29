import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Response } from 'src/response/entities/response.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object last updated',
  })
  updatedAt: Date;

  @Field(() => String, { description: 'Role of this user' })
  role: string;

  @Field(() => String, { description: 'Email of this user' })
  email: string;

  @Field(() => String, { description: 'Username of this user' })
  username: string;

  @Field(() => [Rating], {
    description: 'Rating that this user has made',
    nullable: true,
  })
  ratings: [Rating];

  @Field(() => Int, {
    description: 'Number of ratings that this user has made',
    nullable: true,
  })
  ratingCount: number;

  @Field(() => University, {
    description: 'University that this user is associated with',
    nullable: true,
  })
  university: University;

  @Field(() => Faculty, {
    description: 'Faculty that this user is associated with',
    nullable: true,
  })
  faculty: Faculty;

  @Field(() => [Response], {
    description: 'Responses that this user has created',
    nullable: true,
  })
  responses: [Response];

  @Field(() => Int, {
    description: 'Number of responses that this user has created',
    nullable: true,
  })
  responseCount: number;

  @Field(() => Teacher, {
    description: 'Teacher that this user is associated with',
    nullable: true,
  })
  teacher: Teacher;

  @Field(() => Boolean, {
    description: 'Whether this user (teacher) is verified or not',
    nullable: true,
  })
  isApproved: boolean;

  @Field(() => Boolean, {
    description: 'Whether this user is anonymous or not',
    nullable: true,
  })
  isAnonymous: boolean;
}
