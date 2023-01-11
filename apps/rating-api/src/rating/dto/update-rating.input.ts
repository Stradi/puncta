import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateRatingFilter {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdateRatingSet {
  @IsOptional()
  @Field(() => Int)
  score?: number;

  @IsOptional()
  @Field(() => String)
  comment?: string;

  @IsOptional()
  @Field(() => String)
  meta?: string;
}

@ArgsType()
export class UpdateRatingInput {
  @Field(() => UpdateRatingFilter)
  filter: UpdateRatingFilter;

  @Field(() => UpdateRatingSet)
  set: UpdateRatingSet;
}
