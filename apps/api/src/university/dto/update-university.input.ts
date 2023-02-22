import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class UpdateUniversityFilter extends BaseResourceIdentifierInput {}

@InputType()
export class UpdateUniversitySet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  image?: string;
}

@ArgsType()
export class UpdateUniversityInput {
  @Field(() => UpdateUniversityFilter) filter: UpdateUniversityFilter;
  @Field(() => UpdateUniversitySet) set: UpdateUniversitySet;
}
