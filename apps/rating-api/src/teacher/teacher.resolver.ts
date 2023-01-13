import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/roles.decorator';
import { Role } from 'src/common/role/roles.enum';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { CreateTeacherInput } from './dto/create-teacher.input';
import { DeleteTeacherInput } from './dto/delete-teacher.input';
import { GetTeacherArgs } from './dto/get-teacher.args';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Query(() => [Teacher], { name: 'teacher' })
  async find(@Args() args: GetTeacherArgs) {
    if (args.id && args.id < 0) {
      throw new GenericInvalidParameterError(
        'id',
        'id should be greater than zero',
      );
    }

    if (args.id === undefined && !args.slug && !args.name) {
      return await this.teacherService.findMany(args);
    }

    return [await this.teacherService.findOne(args)];
  }

  @Mutation(() => Teacher)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async createTeacher(@Args() args: CreateTeacherInput) {
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

    if (
      args.faculty.id === undefined &&
      !args.faculty.slug &&
      !args.faculty.name
    ) {
      throw new GenericInvalidParameterError(
        ['id', 'slug', 'name'],
        'At least one faculty filter parameter should be passed',
      );
    }

    return await this.teacherService.create(args);
  }

  @Mutation(() => Teacher)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async updateTeacher(@Args() args: UpdateTeacherInput) {
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

    if (
      !args.set.name &&
      !args.set.slug &&
      !args.set.university &&
      !args.set.faculty
    ) {
      throw new GenericInvalidParameterError(
        'set',
        'At least one set parameter should be passed',
      );
    }

    return await this.teacherService.update(args);
  }

  @Mutation(() => Teacher)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async deleteTeacher(@Args() args: DeleteTeacherInput) {
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

    return await this.teacherService.delete(args);
  }
}
