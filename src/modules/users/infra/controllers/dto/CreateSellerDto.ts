import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  typePerson: string;

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
}
