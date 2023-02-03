import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class SearchArgs {
  @Field(() => String, { description: 'Search query' })
  @IsNotEmpty()
  query: string;
}
