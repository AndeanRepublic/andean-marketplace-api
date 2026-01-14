import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodProductStatus } from '../../../../domain/enums/SuperfoodProductStatus';
import { CreateSuperfoodBasicInfoDto } from './CreateSuperfoodBasicInfoDto';
import { CreateSuperfoodDetailDto } from './CreateSuperfoodDetailDto';
import { CreateSuperfoodNutritionalDto } from './CreateSuperfoodNutritionalDto';
import { CreateSuperfoodOptionsDto } from './CreateSuperfoodOptionsDto';
import { CreateSuperfoodVariantDto } from './CreateSuperfoodVariantDto';

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
	@IsNotEmpty()
	SKU: string;
}

export class CreateSuperfoodDto {
	@ApiProperty({ description: 'ID de categoría de superfood' })
	@IsString()
	@IsNotEmpty()
	categoryId: string;

	@ApiProperty({ enum: SuperfoodProductStatus, default: SuperfoodProductStatus.PENDING })
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

	@ApiProperty({ type: CreateSuperfoodDetailDto })
	@ValidateNested()
	@Type(() => CreateSuperfoodDetailDto)
	detailProduct: CreateSuperfoodDetailDto;

	@ApiProperty({ type: [CreateSuperfoodNutritionalDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateSuperfoodNutritionalDto)
	nutritionalContent: CreateSuperfoodNutritionalDto[];

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
	productTraceability?: any;  // General traceability (to be defined)
}
