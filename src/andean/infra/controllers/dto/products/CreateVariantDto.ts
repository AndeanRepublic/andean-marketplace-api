import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeModel } from '../../../../domain/entities/products/TimeModel';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  attributes: any;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  shippingTime: TimeModel;

  @IsOptional()
  guarantee: TimeModel;
}
