import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from 'src/shared/dto/pagination.args';

@ArgsType()
export class GetResponseArgs extends PaginationArgs {
  @Field(() => Int, { nullable: true })
  id?: number;
}
