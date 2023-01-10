import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';

@ObjectType()
export class Faculty {
  @Field(() => ID, { description: 'Unique identifier for the faculty' })
  id: number;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object created' })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object last updated' })
  updatedAt: Date;

  @Field(() => String, { description: 'Name of the faculty' })
  name: string;

  @Field(() => String, { description: 'Slug of the faculty' })
  slug: string;

  @Field(() => [University], { description: 'The universities that has this faculty' })
  universities: [University];

  @Field(() => [Teacher], { description: 'Teachers of this faculty' })
  teachers: [Teacher];
}
