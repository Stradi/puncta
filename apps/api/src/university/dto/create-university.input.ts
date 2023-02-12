import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class CreateUniversityInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  domain: string;
}
