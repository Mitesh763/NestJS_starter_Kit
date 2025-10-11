import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsStrongPassword()
  password: string;
}
