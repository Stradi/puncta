import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { Rating } from 'src/rating/entities/rating.entity';
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

  @ResolveField('ratings', () => [Rating])
  async ratings(@Parent() user: User, @Args() args: GetRatingArgs) {
    const { id } = user;
    return this.userService.ratings(id, args);
  }

  // TODO: Add updateUser, changePassword mutations.
}
