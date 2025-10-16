import {
  IsEmail,
  IsStrongPassword,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsPhoneNumber('IN', {
    message: 'phone_number Please enter a valid Phone Number',
  })
  phone_number: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
    },
    {
      message:
        'password Password must be at least 8 characters long and contain uppercase, lowercase, number, and symbol.',
    },
  )
  password: string;
}
