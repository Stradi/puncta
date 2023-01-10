import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page = 0;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  pageSize = 10;
}
