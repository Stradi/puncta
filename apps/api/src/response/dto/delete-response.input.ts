import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class DeleteResponseInput {
  @Field(() => Int)
  id: number;
}
