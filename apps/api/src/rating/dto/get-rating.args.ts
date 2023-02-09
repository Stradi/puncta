import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { RatingSortInput } from 'src/shared/dto/sort.args';

@ArgsType()
export class GetRatingArgs extends PaginationArgs {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => RatingSortInput, { nullable: true })
  sort?: RatingSortInput;
}
