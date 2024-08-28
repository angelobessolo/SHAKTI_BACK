import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanearDto } from './create-planear.dto';

export class UpdatePlanearDto extends PartialType(CreatePlanearDto) {}
