import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class ConnectFacultyUniversity extends BaseResourceIdentifierInput {}

@ArgsType()
export class CreateFacultyInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => ConnectFacultyUniversity)
  university: ConnectFacultyUniversity;
}
