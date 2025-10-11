import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
