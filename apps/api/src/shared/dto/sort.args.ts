import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

type SortOrder = 'asc' | 'desc';

@InputType()
class BaseResourceIdentifierSort {
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  createdAt?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  updatedAt?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: SortOrder;
}

@InputType()
export class TeacherSortInput extends BaseResourceIdentifierSort {}

@InputType()
export class FacultySortInput extends BaseResourceIdentifierSort {}

@InputType()
export class UniversitySortInput extends BaseResourceIdentifierSort {}

@InputType()
export class RatingSortInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  createdAt?: SortOrder;

  @IsOptional()
  @Field(() => String, { nullable: true })
  updatedAt?: SortOrder;
}
