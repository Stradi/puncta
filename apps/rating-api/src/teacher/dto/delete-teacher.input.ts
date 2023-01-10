import { ArgsType } from '@nestjs/graphql';
import { BaseResourceIdentifierArgs } from 'src/shared/dto/resource-identifier.args';

@ArgsType()
export class DeleteTeacherInput extends BaseResourceIdentifierArgs {}
