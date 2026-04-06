import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
	Min,
	IsBoolean,
	IsMongoId,
	ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodProductStatus } from '../../../../domain/enums/SuperfoodProductStatus';
import { ProductCurrency } from '../../../../domain/enums/ProductCurrency';
import { CreateSuperfoodBasicInfoDto } from './CreateSuperfoodBasicInfoDto';
import { CreateSuperfoodDetailDto } from './CreateSuperfoodDetailDto';
import { CreateSuperfoodNutritionalDto } from './CreateSuperfoodNutritionalDto';
import { CreateSuperfoodOptionsDto } from './CreateSuperfoodOptionsDto';
import { CreateSuperfoodDetailTraceabilityDto } from './CreateSuperfoodDetailTraceabilityDto';
import { CreateProductTraceabilityDto } from '../traceability/CreateProductTraceabilityDto';
import { CreateDetailSourceProductDto } from '../detailSourceProduct/CreateDetailSourceProductDto';

export class CreateSuperfoodPriceInventoryDto {
	@ApiProperty({
		description: 'Precio base del producto',
		example: 25.5,
		minimum: 0.01,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(0.01, { message: 'Base price must be greater than 0' })
	basePrice!: number;

	@ApiProperty({
		description: 'Stock total disponible',
		example: 100,
		minimum: 0,
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(0, { message: 'Total stock cannot be negative' })
	totalStock!: number;

	@ApiProperty({ enum: ProductCurrency, example: ProductCurrency.PEN })
	@IsEnum(ProductCurrency)
	@IsNotEmpty()
	currency!: ProductCurrency;

	@ApiProperty()
	@IsString()
	@IsOptional()
	SKU?: string;
}

export class CreateSuperfoodDto {
	@ApiProperty({
		enum: SuperfoodProductStatus,
		default: SuperfoodProductStatus.HIDDEN,
	})
	@IsEnum(SuperfoodProductStatus)
	@IsNotEmpty()
	status!: SuperfoodProductStatus;

	@ApiProperty({ type: CreateSuperfoodBasicInfoDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodBasicInfoDto)
	baseInfo!: CreateSuperfoodBasicInfoDto;

	@ApiProperty({ type: CreateSuperfoodPriceInventoryDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodPriceInventoryDto)
	priceInventory!: CreateSuperfoodPriceInventoryDto;

	@ApiPropertyOptional({
		description:
			'ID del color en catálogo (`GET /superfood-colors`). Opcional.',
		example: '507f1f77bcf86cd799439011',
	})
	@IsOptional()
	@ValidateIf((_o, v) => typeof v === 'string' && v.trim().length > 0)
	@IsMongoId({ message: 'colorId must be a valid catalog color ObjectId' })
	colorId?: string;

	@ApiPropertyOptional({
		description:
			'Detalle de origen del producto (se crea/actualiza automáticamente)',
		type: CreateDetailSourceProductDto,
	})
	@ValidateNested()
	@Type(() => CreateDetailSourceProductDto)
	@IsOptional()
	detailSourceProduct?: CreateDetailSourceProductDto;

	@ApiProperty({ description: 'ID de categoría de superfood', required: false })
	@IsString()
	@IsOptional()
	categoryId?: string;

	@ApiProperty({ type: CreateSuperfoodDetailDto, required: false })
	@ValidateNested()
	@Type(() => CreateSuperfoodDetailDto)
	@IsOptional()
	detailProduct?: CreateSuperfoodDetailDto;

	@ApiProperty({ type: [CreateSuperfoodNutritionalDto], required: false })
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodNutritionalDto)
	nutritionalContent?: CreateSuperfoodNutritionalDto[];

	@ApiProperty({ type: [CreateSuperfoodOptionsDto], required: false })
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodOptionsDto)
	options?: CreateSuperfoodOptionsDto[];

	@ApiPropertyOptional({
		description: 'Indica si el descuento está activo para este producto',
		example: false,
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	isDiscountActive?: boolean;

	@ApiProperty({ required: false })
	@IsOptional()
	productTraceability?: CreateProductTraceabilityDto; // General traceability (to be defined)

	@ApiProperty({ required: false })
	@IsOptional()
	detailTraceability?: CreateSuperfoodDetailTraceabilityDto; // Detail traceability
}
