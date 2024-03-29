import { ArgsType, Field } from '@nestjs/graphql';
import { FacultyFilterInput } from 'src/shared/dto/filter.args';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { FacultySortInput } from 'src/shared/dto/sort.args';

@ArgsType()
export class GetFacultyArgs extends PaginationArgs {
  @Field(() => FacultyFilterInput, { nullable: true })
  filter?: FacultyFilterInput;

  @Field(() => FacultySortInput, { nullable: true })
  sort?: FacultySortInput;
}
