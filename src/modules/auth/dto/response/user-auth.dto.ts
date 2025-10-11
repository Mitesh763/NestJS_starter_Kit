import { Expose } from 'class-transformer';

export class UserAuthDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;

  @Expose()
  accessToken: string;
}
