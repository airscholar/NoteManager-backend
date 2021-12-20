import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty()
  dateOfBirth: Date;
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
  @IsNotEmpty()
  @ApiProperty()
  address: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Date)
  dateHired: Date;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  salary: number;
}
