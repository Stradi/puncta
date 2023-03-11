import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { AnonymizerInterceptor } from 'src/common/anonymizer.interceptor';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { RoleGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/roles.decorator';
import { Role } from 'src/common/role/roles.enum';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateRatingInput } from './dto/create-rating.input';
import { DeleteRatingInput } from './dto/delete-rating.input';
import { GetRatingArgs } from './dto/get-rating.args';
import { UpdateRatingInput } from './dto/update-rating.input';
import { Rating } from './entities/rating.entity';
import { RatingService } from './rating.service';

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Query(() => [Rating], { name: 'rating' })
  async find(@Args() args: GetRatingArgs) {
    if (args.id && args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (args.id === undefined) {
      return await this.ratingService.findMany(args);
    }

    return [await this.ratingService.findOne(args)];
  }

  @ResolveField('university', () => University)
  async university(@Parent() rating: Rating) {
    const { id } = rating;
    return await this.ratingService.university(id);
  }

  @ResolveField('teacher', () => Teacher)
  async teacher(@Parent() rating: Rating) {
    const { id } = rating;
    return await this.ratingService.teacher(id);
  }

  @UseInterceptors(AnonymizerInterceptor)
  @ResolveField('user', () => User)
  async user(@Parent() rating: Rating) {
    const { id } = rating;
    return await this.ratingService.user(id);
  }

  @Mutation(() => Rating)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  async createRating(
    @UserEntity() user: User,
    @Args() args: CreateRatingInput,
  ) {
    if (
      args.university?.id === undefined &&
      !args.university?.slug &&
      !args.university?.name &&
      args.teacher?.id === undefined &&
      !args.teacher?.slug &&
      !args.teacher?.name
    ) {
      throw new GenericInvalidParameterError(
        [
          'university.id',
          'university.slug',
          'university.name',
          'teacher.id',
          'teacher.slug',
          'teacher.name',
        ],
        'At least one university or teacher parameter should be passed',
      );
    }

    return await this.ratingService.create(args, user);
  }

  @Mutation(() => Rating)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  async updateRating(
    @UserEntity() user: User,
    @Args() args: UpdateRatingInput,
  ) {
    if (args.filter.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (
      user.role !== 'ADMIN' &&
      !user.ratings.some((rating) => rating.id === args.filter.id)
    ) {
      throw new GenericInvalidParameterError(
        'id',
        'User does not have permission to update this rating',
      );
    }

    if (!args.set.comment && !args.set.meta) {
      throw new GenericInvalidParameterError(
        'set',
        'At least one set parameter should be passed',
      );
    }

    return await this.ratingService.update(args);
  }

  @Mutation(() => Rating)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STUDENT)
  async deleteRating(@Args() args: DeleteRatingInput) {
    if (args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    return await this.ratingService.delete(args);
  }
}
