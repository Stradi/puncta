import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class ConnectUserUniversity extends BaseResourceIdentifierInput {}

@InputType()
export class ConnectUserFaculty extends BaseResourceIdentifierInput {}

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

  @Field(() => ConnectUserUniversity)
  // @IsNotEmpty()
  university?: ConnectUserUniversity;

  @Field(() => ConnectUserFaculty)
  // @IsNotEmpty()
  faculty?: ConnectUserFaculty;
}
