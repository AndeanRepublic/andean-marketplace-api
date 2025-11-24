import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CoinType } from '../../../domain/enums/CoinType';

export class UpdateCustomerProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  profilePictureUrl: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsEnum(CoinType)
  @IsNotEmpty()
  coin: CoinType;
}
