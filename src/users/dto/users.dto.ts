import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  phone: number;

  @IsString()
  password: string;
}

export class UpdateUserDto extends OmitType(PartialType(UserDto), [
  'password',
] as const) {}
