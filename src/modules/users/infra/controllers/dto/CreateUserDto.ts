import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CoinType } from '../../../domain/enums/CoinType';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsEnum(CoinType)
  @IsNotEmpty()
  coin: CoinType;

  @IsString()
  @IsNotEmpty()
  password: string;
}
