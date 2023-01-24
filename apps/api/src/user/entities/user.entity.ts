import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Rating } from 'src/rating/entities/rating.entity';
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

  @Field(() => String, {
    description: 'First name of this user',
    nullable: true,
  })
  firstName: string;

  @Field(() => String, {
    description: 'Last name of this user',
    nullable: true,
  })
  lastName: string;

  @Field(() => [Rating], {
    description: 'Rating that this user has made',
    nullable: true,
  })
  ratings: [Rating];

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
}
