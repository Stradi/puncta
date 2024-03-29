import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/roles.decorator';
import { Role } from 'src/common/role/roles.enum';
import { GetFacultyArgs } from 'src/faculty/dto/get-faculty.args';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { GetRatingArgs } from 'src/rating/dto/get-rating.args';
import { Rating } from 'src/rating/entities/rating.entity';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { GetTeacherArgs } from 'src/teacher/dto/get-teacher.args';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { CreateUniversityInput } from './dto/create-university.input';
import { DeleteUniversityInput } from './dto/delete-university.input';
import { GetUniversityArgs } from './dto/get-university.args';
import { UpdateUniversityInput } from './dto/update-university.input';
import { University } from './entities/university.entity';
import { UniversityService } from './university.service';

@Resolver(() => University)
export class UniversityResolver {
  constructor(private readonly universityService: UniversityService) {}

  @Query(() => [University], { name: 'university' })
  async find(@Args() args: GetUniversityArgs) {
    return await this.universityService.findMany(args);
  }

  @ResolveField('faculties', () => [Faculty])
  async faculties(
    @Parent() university: University,
    @Args() args: GetFacultyArgs,
  ) {
    const { id } = university;
    return await this.universityService.faculties(id, args);
  }

  @ResolveField('facultyCount', () => Number)
  async facultyCount(@Parent() university: University) {
    const { id } = university;
    return await this.universityService.facultyCount(id);
  }

  @ResolveField('teachers', () => [Teacher])
  async teachers(
    @Parent() university: University,
    @Args() args: GetTeacherArgs,
  ) {
    const { id } = university;
    return await this.universityService.teachers(id, args);
  }

  @ResolveField('teacherCount', () => Number)
  async teacherCount(@Parent() university: University) {
    const { id } = university;
    return await this.universityService.teacherCount(id);
  }

  @ResolveField('ratings', () => [Rating])
  async ratings(@Parent() university: University, @Args() args: GetRatingArgs) {
    const { id } = university;
    return await this.universityService.ratings(id, args);
  }

  @ResolveField('ratingCount', () => Number)
  async ratingCount(@Parent() university: University) {
    const { id } = university;
    return await this.universityService.ratingCount(id);
  }

  @Mutation(() => University)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async createUniversity(@Args() args: CreateUniversityInput) {
    return await this.universityService.create(args);
  }

  @Mutation(() => University)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async updateUniversity(@Args() args: UpdateUniversityInput) {
    if (args.filter.id && args.filter.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (
      args.filter.id === undefined &&
      !args.filter.slug &&
      !args.filter.name
    ) {
      throw new GenericInvalidParameterError(
        'filter',
        'At least one filter parameter should be passed',
      );
    }

    if (!args.set.name && !args.set.slug && !args.set.image) {
      throw new GenericInvalidParameterError(
        'set',
        'At least one set parameter should be passed',
      );
    }

    return await this.universityService.update(args);
  }

  @Mutation(() => University)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async deleteUniversity(@Args() args: DeleteUniversityInput) {
    if (args.id && args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (args.id === undefined && !args.slug && !args.name) {
      throw new GenericInvalidParameterError(
        ['id', 'slug', 'name'],
        'At least one filter parameter should be passed',
      );
    }

    return await this.universityService.delete(args);
  }
}
