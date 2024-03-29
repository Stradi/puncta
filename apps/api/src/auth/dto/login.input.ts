import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@ArgsType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
