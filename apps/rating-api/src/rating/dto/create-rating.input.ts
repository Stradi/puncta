import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResourceIdentifierInput } from 'src/shared/dto/resource-identifier.args';

@InputType()
export class ConnectRatingUniversity extends BaseResourceIdentifierInput {}

@InputType()
export class ConnectRatingTeacher extends BaseResourceIdentifierInput {}

@ArgsType()
export class CreateRatingInput {
  @Field(() => Int)
  score: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  comment?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  meta?: string;

  @IsOptional()
  @Field(() => ConnectRatingUniversity, { nullable: true })
  university?: ConnectRatingUniversity;

  @IsOptional()
  @Field(() => ConnectRatingTeacher, { nullable: true })
  teacher?: ConnectRatingTeacher;
}
