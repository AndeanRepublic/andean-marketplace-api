import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TypePerson } from '../../../domain/enums/TypePerson';

export class CreateSellerDto {
  @IsEnum(TypePerson)
  @IsNotEmpty()
  typePerson: TypePerson;

  @IsString()
  @IsNotEmpty()
  numberDocument: string;

  @IsString()
  @IsOptional()
  ruc?: string;

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
