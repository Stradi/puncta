import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class BaseResourceIdentifierArgs {
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
    description: 'Unique identifier of the resource',
  })
  id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Name of the resource' })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Slug of the resource' })
  slug?: string;
}

@InputType()
export class BaseResourceIdentifierInput {
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
    description: 'Unique identifier of the resource',
  })
  id?: number;

  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Name of the resource' })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Slug of the resource' })
  slug?: string;
}
