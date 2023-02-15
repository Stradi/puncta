import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { ApprovedTeacherGuard } from 'src/common/approved-teacher.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { RoleGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/roles.decorator';
import { Role } from 'src/common/role/roles.enum';
import { Rating } from 'src/rating/entities/rating.entity';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { User } from 'src/user/entities/user.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { DeleteResponseInput } from './dto/delete-response.input';
import { GetResponseArgs } from './dto/get-response.args';
import { UpdateResponseInput } from './dto/update-response.input';
import { Response } from './entities/response.entity';
import { ResponseService } from './response.service';

@Resolver(() => Response)
export class ResponseResolver {
  constructor(private readonly responseService: ResponseService) {}

  @Query(() => [Response], { name: 'response' })
  async find(@Args() args: GetResponseArgs) {
    if (args.id && args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (args.id === undefined) {
      return await this.responseService.findMany(args);
    }

    return [await this.responseService.findOne(args)];
  }

  @ResolveField('to', () => Rating)
  async to(@Parent() response: Response) {
    const { id } = response;
    return await this.responseService.to(id);
  }

  // This field is TEACHER. Not STUDENT.
  @ResolveField('from', () => User)
  async from(@Parent() response: Response) {
    const { id } = response;
    return await this.responseService.from(id);
  }

  @Mutation(() => Response)
  @UseGuards(GqlAuthGuard, RoleGuard, ApprovedTeacherGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  async createResponse(
    @UserEntity() user: User,
    @Args() args: CreateResponseInput,
  ) {
    return await this.responseService.create(args, user);
  }

  @Mutation(() => Response)
  @UseGuards(GqlAuthGuard, RoleGuard, ApprovedTeacherGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  async updateResponse(
    @UserEntity() user: User,
    @Args() args: UpdateResponseInput,
  ) {
    if (args.filter.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (
      user.role !== Role.ADMIN &&
      !user.responses.some((response) => response.id === args.filter.id)
    ) {
      throw new GenericInvalidParameterError(
        'from',
        'You are not allowed to update this response',
      );
    }

    if (!args.set.content && !args.set.meta) {
      throw new GenericInvalidParameterError(
        'set',
        'You must provide at least one field to update',
      );
    }

    return await this.responseService.update(args);
  }

  @Mutation(() => Response)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async deleteResponse(@Args() args: DeleteResponseInput) {
    if (args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    return await this.responseService.delete(args);
  }
}
