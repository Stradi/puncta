import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateResponseFilter {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdateResponseSet {
  @IsOptional()
  @Field(() => String, { nullable: true })
  content?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  meta?: string;
}

@ArgsType()
export class UpdateResponseInput {
  @Field(() => UpdateResponseFilter)
  filter: UpdateResponseFilter;

  @Field(() => UpdateResponseSet)
  set: UpdateResponseSet;
}
