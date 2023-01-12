import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Rating } from 'src/rating/entities/rating.entity';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id: number;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object created' })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { description: 'Date the this object last updated' })
  updatedAt: Date;

  @Field(() => String, { description: 'Role of this user' })
  role: string;

  @Field(() => String, { description: 'Username of this user' })
  username: string;

  @Field(() => String, { description: 'Email of this user' })
  email: string;

  @Field(() => String, { description: 'First name of this user', nullable: true })
  firstName: string;

  @Field(() => String, { description: 'Last name of this user', nullable: true })
  lastName: string;

  @Field(() => [Rating], { description: 'Rating that this user has made', nullable: true })
  ratings: [Rating];
}
