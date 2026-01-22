import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export class AddCartItemDto {

	@IsString()
	@IsNotEmpty()
	cartShopId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  productType: ProductType;

  @IsString()
  @IsOptional()
  productVariantId?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	unitPrice: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;
}
