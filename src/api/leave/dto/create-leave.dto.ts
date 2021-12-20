import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateLeaveDTO {
  @IsNotEmpty()
  leaveType: string;

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsNotEmpty()
  comments: string;

  @Optional()
  status?: 'Approved' | 'Denied' | 'Pending';

  @IsNotEmpty()
  email: string;
}
