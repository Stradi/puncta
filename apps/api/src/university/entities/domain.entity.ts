import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { University } from './university.entity';

@ObjectType()
export class Domain {
  @Field(() => ID, { description: 'Unique identifier for the domain' })
  id: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object created',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date the this object last updated',
  })
  updatedAt: Date;

  @Field(() => String, { description: 'Name of the domain' })
  name: string;

  @Field(() => University, { description: 'University of the domain' })
  university: University;
}
