import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PaginationArgs } from 'src/shared/dto/pagination.args';

@ArgsType()
export class SearchArgs extends PaginationArgs {
  @Field(() => String, { description: 'Search query' })
  @IsNotEmpty()
  query: string;
}
