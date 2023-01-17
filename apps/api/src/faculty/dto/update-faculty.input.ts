import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class UpdateFacultyFilter extends BaseResourceIdentifierInput {}

@InputType()
export class UpdateFacultySet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  slug?: string;
}

@ArgsType()
export class UpdateFacultyInput {
  @Field(() => UpdateFacultyFilter) filter: UpdateFacultyFilter;
  @Field(() => UpdateFacultySet) set: UpdateFacultySet;
}
