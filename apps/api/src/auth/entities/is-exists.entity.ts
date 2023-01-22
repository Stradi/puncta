import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IsExists {
  @Field(() => Boolean, { description: 'Is exists' })
  result: boolean;
}
