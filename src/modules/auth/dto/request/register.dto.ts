import {
  IsEmail,
  IsStrongPassword,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  name: string;

  @IsStrongPassword()
  password: string;
}
