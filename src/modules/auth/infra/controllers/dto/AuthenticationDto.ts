import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
