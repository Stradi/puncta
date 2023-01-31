import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { Rating } from 'src/rating/entities/rating.entity';
import { GetUniversityArgs } from 'src/university/dto/get-university.args';
import { University } from 'src/university/entities/university.entity';
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

  @ResolveField('university', () => University)
  async university(@Parent() user: User, @Args() args: GetUniversityArgs) {
    const { id } = user;
    return this.userService.university(id, args);
  }

  @ResolveField('faculty', () => Faculty)
  async faculty(@Parent() user: User, @Args() args: GetFacultyArgs) {
    const { id } = user;
    return this.userService.faculty(id, args);
  }

  // TODO: Add updateUser, changePassword mutations.
}
