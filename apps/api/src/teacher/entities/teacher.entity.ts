import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { University } from 'src/university/entities/university.entity';

@ObjectType()
export class Teacher {
  @Field(() => ID, { description: 'Unique identifier for the teacher' })
  id: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object last updated',
  })
  updatedAt: Date;

  @Field(() => String, { description: 'Name of the faculty' })
  name: string;

  @Field(() => String, { description: 'Slug of the faculty' })
  slug: string;

  @Field(() => University, {
    description: 'The university that this teacher works',
    nullable: true,
  })
  university: University;

  @Field(() => Faculty, {
    description: 'The faculty that this teacher works',
    nullable: true,
  })
  faculty: Faculty;

  @Field(() => [Rating], {
    description: 'Ratings of this teacher',
    nullable: true,
  })
  ratings: [Rating];

  @Field(() => Int, {
    description: 'Number of ratings of this teacher',
    nullable: true,
  })
  ratingCount: number;
}
