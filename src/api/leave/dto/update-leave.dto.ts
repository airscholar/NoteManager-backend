import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveDTO } from './create-leave.dto';

export class UpdateLeaveDTO extends PartialType(CreateLeaveDTO) {}
