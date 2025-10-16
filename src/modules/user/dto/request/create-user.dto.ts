import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name Please Enter Valid Name' })
  name: string;

  @IsEmail(
    {},
    {
      message: 'email Please enter a valid email address.',
    },
  )
  email: string;

  @IsPhoneNumber('IN', {
    message: 'phone_number Please enter a valid Phone Number',
  })
  phone_number: string;

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
