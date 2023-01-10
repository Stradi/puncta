import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class UpdateTeacherSetUniversity extends BaseResourceIdentifierInput {}

@InputType()
export class UpdateTeacherSetFaculty extends BaseResourceIdentifierInput {}

@InputType()
export class UpdateTeacherFilter extends BaseResourceIdentifierInput {}

@InputType()
export class UpdateTeacherSet {
  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  slug?: string;

  @Field(() => UpdateTeacherSetUniversity, { nullable: true })
  @IsOptional()
  university: UpdateTeacherSetUniversity;

  @Field(() => UpdateTeacherSetFaculty, { nullable: true })
  @IsOptional()
  faculty: UpdateTeacherSetFaculty;
}

@ArgsType()
export class UpdateTeacherInput {
  @Field(() => UpdateTeacherFilter) filter: UpdateTeacherFilter;
  @Field(() => UpdateTeacherSet) set: UpdateTeacherSet;
}
