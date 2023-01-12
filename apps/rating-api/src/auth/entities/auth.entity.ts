import { ObjectType } from '@nestjs/graphql';
import { Token } from './token.entity';

@ObjectType()
export class Auth extends Token {}
