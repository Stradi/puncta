import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CreateResponseInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  meta: string;

  @Field(() => Int)
  to: number;

  // We don't need `from` field because we are getting that from
  // the AuthGuard
}
