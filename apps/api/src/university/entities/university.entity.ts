import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Domain } from './domain.entity';

@ObjectType()
export class University {
  @Field(() => ID, { description: 'Unique identifier for the university' })
  id: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object last updated',
  })
  updatedAt: Date;

  @Field(() => String, { description: 'Name of the university' })
  name: string;

  @Field(() => String, { description: 'Slug of the university' })
  slug: string;

  @Field(() => [Faculty], {
    description: 'Faculties of this university',
    nullable: true,
  })
  faculties: [Faculty];

  @Field(() => Int, {
    description: 'Number of faculties of this university',
    nullable: true,
  })
  facultyCount: number;

  @Field(() => [Teacher], {
    description: 'Teachers of this university',
    nullable: true,
  })
  teachers: [Teacher];

  @Field(() => Int, {
    description: 'Number of teachers of this university',
    nullable: true,
  })
  teacherCount: number;

  @Field(() => [Rating], {
    description: 'Ratings of this university',
    nullable: true,
  })
  ratings: [Rating];

  @Field(() => Int, {
    description: 'Number of ratings of this university',
    nullable: true,
  })
  ratingCount: number;

  @Field(() => Domain, {
    description: 'Domain of this university',
  })
  domain: Domain;

  @Field(() => String, {
    description: 'Logo of this university',
    nullable: true,
  })
  image: string;
}
