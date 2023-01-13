import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/roles.decorator';
import { Role } from 'src/common/role/roles.enum';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { DeleteFacultyInput } from './dto/delete-faculty.input';
import { GetFacultyArgs } from './dto/get-faculty.args';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { Faculty } from './entities/faculty.entity';
import { FacultyService } from './faculty.service';

@Resolver(() => Faculty)
export class FacultyResolver {
  constructor(private readonly facultyService: FacultyService) {}

  @Query(() => [Faculty], { name: 'faculty' })
  async find(@Args() args: GetFacultyArgs) {
    if (args.id && args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (args.id === undefined && !args.slug && !args.name) {
      return await this.facultyService.findMany(args);
    }

    return [await this.facultyService.findOne(args)];
  }

  @Mutation(() => Faculty)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async createFaculty(@Args() args: CreateFacultyInput) {
    if (
      args.university.id === undefined &&
      !args.university.slug &&
      !args.university.name
    ) {
      throw new GenericInvalidParameterError(
        ['id', 'slug', 'name'],
        'At least one university filter parameter should be passed',
      );
    }

    return await this.facultyService.create(args);
  }

  @Mutation(() => Faculty)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async updateFaculty(@Args() args: UpdateFacultyInput) {
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

    if (!args.set.name && !args.set.slug) {
      throw new GenericInvalidParameterError(
        'set',
        'At least one set parameter should be passed',
      );
    }

    return await this.facultyService.update(args);
  }

  @Mutation(() => Faculty)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async deleteFaculty(@Args() args: DeleteFacultyInput) {
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

    return await this.facultyService.delete(args);
  }
}
