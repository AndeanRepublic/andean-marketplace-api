import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { PersonType } from '../../../domain/enums/PersonType';

export class CreateSellerDto {
  @IsEnum(PersonType)
  @IsNotEmpty()
  typePerson: PersonType;

  @IsString()
  @IsNotEmpty()
  numberDocument: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  commercialName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
