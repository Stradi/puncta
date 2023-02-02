import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/common/role/roles.enum';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class ConnectUserUniversity extends BaseResourceIdentifierInput {}

@InputType()
export class ConnectUserFaculty extends BaseResourceIdentifierInput {}

@InputType()
export class ConnectUserTeacher extends BaseResourceIdentifierInput {}

@ArgsType()
export class SignupInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  firstName: string;

  @Field(() => String)
  @IsNotEmpty()
  lastName: string;

  @Field(() => ConnectUserUniversity, { nullable: true })
  university?: ConnectUserUniversity;

  @Field(() => ConnectUserFaculty, { nullable: true })
  faculty?: ConnectUserFaculty;

  @Field(() => String, { nullable: true })
  role?: Role;

  @Field(() => ConnectUserTeacher, { nullable: true })
  teacher?: ConnectUserTeacher;
}
