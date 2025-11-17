import { ShopCategory } from '../../../domain/enums/ShopCategory';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ShopCategory, { each: true })
  categories: ShopCategory[];

  @IsString()
  @IsNotEmpty()
  policies: string;

  @IsString()
  @IsNotEmpty()
  shippingOrigin: string;

  @IsString()
  @IsNotEmpty()
  shippingArea: string;
}
