import { ArgsType, Field } from '@nestjs/graphql';
import { TeacherFilterInput } from 'src/shared/dto/filter.args';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { TeacherSortInput } from 'src/shared/dto/sort.args';

@ArgsType()
export class GetTeacherArgs extends PaginationArgs {
  @Field(() => TeacherFilterInput, { nullable: true })
  filter?: TeacherFilterInput;

  @Field(() => TeacherSortInput, { nullable: true })
  sort?: TeacherSortInput;
}
