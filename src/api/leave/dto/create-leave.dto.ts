import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateLeaveDTO {
  @IsNotEmpty()
  @ApiProperty()
  leaveType: string;

  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  comments: string;

  @Optional()
  @ApiPropertyOptional()
  status?: 'Approved' | 'Denied' | 'Pending';

  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
