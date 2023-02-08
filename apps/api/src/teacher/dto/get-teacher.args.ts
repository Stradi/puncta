import { ArgsType, Field } from '@nestjs/graphql';
import { TeacherFilterInput } from 'src/shared/dto/filter.args';
import { PaginationArgs } from 'src/shared/dto/pagination.args';

@ArgsType()
export class GetTeacherArgs extends PaginationArgs {
  @Field(() => TeacherFilterInput, { nullable: true })
  filter?: TeacherFilterInput;
}
