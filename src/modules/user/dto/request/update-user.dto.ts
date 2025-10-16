import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
export class UpdateUserDto {
  @IsString({ message: 'name Please Enter Valid Name' })
  @IsOptional()
  name: string;

  @IsEmail(
    {},
    {
      message: 'email Please Enter Valid Email',
    },
  )
  @IsOptional()
  email: string;

  @IsPhoneNumber('IN', {
    message: 'phone_number Please enter a valid Phone Number',
  })
  @IsOptional()
  phone_number: string;
}
