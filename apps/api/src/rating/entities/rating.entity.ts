import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Rating {
  @Field(() => ID, { description: 'Unique identifier for rating' })
  id: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object last updated',
  })
  updatedAt: Date;

  @Field(() => Int, { description: 'Score of this rating' })
  score: number;

  @Field(() => String, {
    description: 'Message of this rating',
    nullable: true,
  })
  comment: string;

  @Field(() => String, {
    description: 'Additional meta field for this rating',
    nullable: true,
  })
  meta: string;

  @Field(() => University, {
    description: 'The university that this rating rates',
    nullable: true,
  })
  university: University;

  @Field(() => Teacher, {
    description: 'The university that this rating rates',
    nullable: true,
  })
  teacher: Teacher;

  @Field(() => User, {
    description: 'The user that created this rating',
    nullable: true,
  })
  user: User;
}
