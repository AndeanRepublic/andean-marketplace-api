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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodProductStatus } from '../../../../domain/enums/SuperfoodProductStatus';
import { CreateSuperfoodBasicInfoDto } from './CreateSuperfoodBasicInfoDto';
import { CreateSuperfoodDetailDto } from './CreateSuperfoodDetailDto';
import { CreateSuperfoodNutritionalDto } from './CreateSuperfoodNutritionalDto';
import { CreateSuperfoodOptionsDto } from './CreateSuperfoodOptionsDto';
import { CreateSuperfoodDetailTraceabilityDto } from './CreateSuperfoodDetailTraceabilityDto';
import { CreateProductTraceabilityDto } from '../traceability/CreateProductTraceabilityDto';

export class CreateSuperfoodPriceInventoryDto {
	@ApiProperty({ description: 'Precio base del producto', example: 25.50, minimum: 0.01 })
	@IsNumber()
	@IsNotEmpty()
	@Min(0.01, { message: 'Base price must be greater than 0' })
	basePrice: number;

	@ApiProperty({ description: 'Stock total disponible', example: 100, minimum: 0 })
	@IsNumber()
	@IsNotEmpty()
	@Min(0, { message: 'Total stock cannot be negative' })
	totalStock: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	SKU?: string;
}

export class CreateSuperfoodDto {
	@ApiProperty({
		enum: SuperfoodProductStatus,
		default: SuperfoodProductStatus.PENDING,
	})
	@IsEnum(SuperfoodProductStatus)
	@IsNotEmpty()
	status: SuperfoodProductStatus;

	@ApiProperty({ type: CreateSuperfoodBasicInfoDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodBasicInfoDto)
	baseInfo: CreateSuperfoodBasicInfoDto;

	@ApiProperty({ type: CreateSuperfoodPriceInventoryDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodPriceInventoryDto)
	priceInventory: CreateSuperfoodPriceInventoryDto;

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
