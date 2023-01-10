import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/shared/dto/pagination.args';
import { BaseResourceIdentifierArgs } from 'src/shared/dto/resource-identifier.args';

@ArgsType()
export class GetFacultyArgs extends IntersectionType(BaseResourceIdentifierArgs, PaginationArgs) {}
