import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
class StringFilter {
  @IsOptional()
  @Field(() => String, { nullable: true })
  equals?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  in?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notIn?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  contains?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  startsWith?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  endsWith?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  not?: string;
}

@InputType()
class IntFilter {
  @IsOptional()
  @Field(() => Number, { nullable: true })
  equals?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  in?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  notIn?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  lt?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  lte?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  gt?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  gte?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  not?: number;
}

@InputType()
class BaseResourceIdentifierFilter {
  @IsOptional()
  @Field(() => IntFilter, { nullable: true })
  id?: IntFilter;

  @IsOptional()
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @IsOptional()
  @Field(() => StringFilter, { nullable: true })
  slug?: StringFilter;
}

@InputType()
export class TeacherFilterInput extends BaseResourceIdentifierFilter {
  @IsOptional()
  @Field(() => BaseResourceIdentifierFilter, { nullable: true })
  university?: BaseResourceIdentifierFilter;

  @IsOptional()
  @Field(() => BaseResourceIdentifierFilter, { nullable: true })
  faculty?: BaseResourceIdentifierFilter;
}

@InputType()
export class FacultyFilterInput extends BaseResourceIdentifierFilter {
  @IsOptional()
  @Field(() => BaseResourceIdentifierFilter, { nullable: true })
  university?: BaseResourceIdentifierFilter;
}

@InputType()
export class UniversityFilterInput extends BaseResourceIdentifierFilter {}
