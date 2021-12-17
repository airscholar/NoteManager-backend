import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @Type(() => Date)
  dateHired: Date;
  @IsNotEmpty()
  @IsNumber()
  salary: number;
}
