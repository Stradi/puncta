import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Rating } from 'src/rating/entities/rating.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Response {
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

  @Field(() => String, {
    description: 'Content of the response',
  })
  content: string;

  @Field(() => String, {
    description: 'Additional meta field for this rating',
  })
  meta: string;

  @Field(() => Rating, {
    description: 'The ratingg that this response belongs to',
  })
  to: Rating;

  @Field(() => User, {
    description: 'The teacher that created this response',
  })
  from: User;
}
