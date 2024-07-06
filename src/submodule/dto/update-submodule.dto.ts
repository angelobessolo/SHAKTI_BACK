import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmoduleDto } from './create-submodule.dto';

export class UpdateSubmoduleDto extends PartialType(CreateSubmoduleDto) {}
