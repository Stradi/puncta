import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Response } from 'src/response/entities/response.entity';
import { University } from 'src/university/entities/university.entity';
import { GetUserArgs } from './dto/get-user.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async find(@Args() args: GetUserArgs) {
    return this.userService.find(args);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@UserEntity() user: User) {
    return user;
  }

  @ResolveField('ratings', () => [Rating])
  async ratings(@Parent() user: User) {
    const { id } = user;
    return this.userService.ratings(id);
  }

  @ResolveField('ratingCount', () => Number)
  async ratingCount(@Parent() user: User) {
    const { id } = user;
    return this.userService.ratingCount(id);
  }

  @ResolveField('university', () => University)
  async university(@Parent() user: User) {
    const { id } = user;
    return this.userService.university(id);
  }

  @ResolveField('faculty', () => Faculty)
  async faculty(@Parent() user: User) {
    const { id } = user;
    return this.userService.faculty(id);
  }

  @ResolveField('response', () => [Response])
  async response(@Parent() user: User) {
    const { id } = user;
    return this.userService.response(id);
  }

  @ResolveField('responseCount', () => Number)
  async responseCount(@Parent() user: User) {
    const { id } = user;
    return this.userService.responseCount(id);
  }

  // TODO: Add updateUser, changePassword mutations.
}
