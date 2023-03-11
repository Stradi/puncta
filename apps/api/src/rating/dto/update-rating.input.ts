import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateRatingFilter {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdateRatingSet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  comment?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  meta?: string;
}

@ArgsType()
export class UpdateRatingInput {
  @Field(() => UpdateRatingFilter)
  filter: UpdateRatingFilter;

  @Field(() => UpdateRatingSet)
  set: UpdateRatingSet;
}
