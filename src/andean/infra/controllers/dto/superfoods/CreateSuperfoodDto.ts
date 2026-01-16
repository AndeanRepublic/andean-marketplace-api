import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodProductStatus } from '../../../../domain/enums/SuperfoodProductStatus';
import { CreateSuperfoodBasicInfoDto } from './CreateSuperfoodBasicInfoDto';
import { CreateSuperfoodDetailDto } from './CreateSuperfoodDetailDto';
import { CreateSuperfoodNutritionalDto } from './CreateSuperfoodNutritionalDto';
import { CreateSuperfoodOptionsDto } from './CreateSuperfoodOptionsDto';
import { CreateSuperfoodVariantDto } from './CreateSuperfoodVariantDto';
import { CreateSuperfoodDetailTraceabilityDto } from './CreateSuperfoodDetailTraceabilityDto';
import { CreateProductTraceabilityDto } from '../traceability/CreateProductTraceabilityDto';

export class CreateSuperfoodPriceInventoryDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	basePrice: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
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

	@ApiProperty({ type: [CreateSuperfoodVariantDto], required: false })
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodVariantDto)
	variants?: CreateSuperfoodVariantDto[];

	@ApiProperty({ required: false })
	@IsOptional()
	productTraceability?: CreateProductTraceabilityDto; // General traceability (to be defined)

	@ApiProperty({ required: false })
	@IsOptional()
	detailTraceability?: CreateSuperfoodDetailTraceabilityDto; // Detail traceability
}
