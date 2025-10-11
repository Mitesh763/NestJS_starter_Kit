import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;
}
