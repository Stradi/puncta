import { ArgsType, Field } from '@nestjs/graphql';
import { UniversityFilterInput } from 'src/shared/dto/filter.args';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { UniversitySortInput } from 'src/shared/dto/sort.args';

@ArgsType()
export class GetUniversityArgs extends PaginationArgs {
  @Field(() => UniversityFilterInput, { nullable: true })
  filter?: UniversityFilterInput;

  @Field(() => UniversitySortInput, { nullable: true })
  sort?: UniversitySortInput;
}
