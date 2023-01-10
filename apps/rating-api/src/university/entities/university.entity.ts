import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@ObjectType()
export class University {
  @Field(() => ID, { description: 'Unique identifier for the university' })
  id: number;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object created' })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object last updated' })
  updatedAt: Date;

  @Field(() => String, { description: 'Name of the university' })
  name: string;

  @Field(() => String, { description: 'Slug of the university' })
  slug: string;

  @Field(() => [Faculty], { description: 'Faculties of this university' })
  faculties: [Faculty];

  @Field(() => [Teacher], { description: 'Teachers of this university' })
  teachers: [Teacher];
}
