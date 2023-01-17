import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class DeleteRatingInput {
  @Field(() => Int)
  id: number;
}
