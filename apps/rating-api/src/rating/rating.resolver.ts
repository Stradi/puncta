import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
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
      throw new GenericInvalidParameterError('id', 'id should be greater than zero');
    }

    if (args.id === undefined) {
      return await this.ratingService.findMany(args);
    }

    return [await this.ratingService.findOne(args)];
  }

  @Mutation(() => Rating)
  async createRating(@Args() args: CreateRatingInput) {
    if (args.score < 0 || args.score > 100) {
      throw new GenericInvalidParameterError('score', 'score should be between 0 and 100');
    }

    if (
      args.university?.id === undefined &&
      !args.university?.slug &&
      !args.university?.name &&
      args.teacher?.id === undefined &&
      !args.teacher?.slug &&
      !args.teacher?.name
    ) {
      throw new GenericInvalidParameterError(
        ['university.id', 'university.slug', 'university.name', 'teacher.id', 'teacher.slug', 'teacher.name'],
        'At least one university or teacher parameter should be passed',
      );
    }

    return await this.ratingService.create(args);
  }

  @Mutation(() => Rating)
  async updateRating(@Args() args: UpdateRatingInput) {
    if (args.filter.id < 0) {
      throw new GenericInvalidParameterError('id', 'id should be greater than zero');
    }

    if (!args.set.score && !args.set.comment && !args.set.meta) {
      throw new GenericInvalidParameterError('set', 'At least one set parameter should be passed');
    }

    return await this.ratingService.update(args);
  }

  @Mutation(() => Rating)
  async deleteRating(@Args() args: DeleteRatingInput) {
    if (args.id < 0) {
      throw new GenericInvalidParameterError('id', 'id should be greater than zero');
    }

    return await this.ratingService.delete(args);
  }
}
