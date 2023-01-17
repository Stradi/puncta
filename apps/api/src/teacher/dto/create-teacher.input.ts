import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class ConnectTeacherUniversity extends BaseResourceIdentifierInput {}

@InputType()
export class ConnectTeacherFaculty extends BaseResourceIdentifierInput {}

@ArgsType()
export class CreateTeacherInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => ConnectTeacherUniversity)
  @IsNotEmpty()
  university: ConnectTeacherUniversity;

  @Field(() => ConnectTeacherFaculty)
  @IsNotEmpty()
  faculty: ConnectTeacherFaculty;
}
