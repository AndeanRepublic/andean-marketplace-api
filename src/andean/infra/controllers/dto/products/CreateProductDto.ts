import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeModel } from '../../../../domain/entities/products/TimeModel';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  attributes: any;

  @IsOptional()
  guarantee: TimeModel;

  @IsOptional()
  shippingTime: TimeModel;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
