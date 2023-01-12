import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async me(@UserEntity() user: User) {
    return user;
  }

  // TODO: Add updateUser, changePassword mutations.
}
