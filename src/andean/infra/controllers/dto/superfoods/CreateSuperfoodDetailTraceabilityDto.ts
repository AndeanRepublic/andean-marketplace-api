import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodProductionMethod } from '../../../../domain/enums/SuperfoodProductionMethod';

export class SuperfoodProductDimensionsDto {
	@ApiProperty({ description: 'Largo en cm', example: 12 })
	@IsNumber()
	@Min(0)
	length!: number;

	@ApiProperty({ description: 'Ancho en cm', example: 8 })
	@IsNumber()
	@Min(0)
	width!: number;

	@ApiProperty({ description: 'Alto en cm', example: 4 })
	@IsNumber()
	@Min(0)
	height!: number;
}

export class CreateSuperfoodDetailTraceabilityDto {
	@ApiPropertyOptional({
		description: 'Origen: región, comunidad, altitud, etc.',
	})
	@IsString()
	@IsOptional()
	productOrigin?: string;

	@ApiPropertyOptional({
		description: 'ID en catálogo DetailSourceProduct (especie/variedad)',
	})
	@IsString()
	@IsOptional()
	exactSpeciesOrVarietyId?: string;

	@ApiPropertyOptional({ enum: SuperfoodProductionMethod })
	@IsEnum(SuperfoodProductionMethod)
	@IsOptional()
	productionMethod?: SuperfoodProductionMethod;

	@ApiPropertyOptional({ description: 'ID método de preservación (catálogo)' })
	@IsString()
	@IsOptional()
	preservationMethodId?: string;

	@ApiPropertyOptional({
		type: [String],
		description: 'IDs de certificaciones',
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	certificationIds?: string[];

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	sanitaryRegistryNumber?: string;

	@ApiPropertyOptional({ type: String, format: 'date-time' })
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	expirationDate?: Date;

	@ApiPropertyOptional({ type: String, format: 'date-time' })
	@Type(() => Date)
	@IsDate()
	@IsOptional()
	productionDate?: Date;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	lotNumber?: string;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isNatural?: boolean;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isArtesanal?: boolean;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isEatableWithoutPrep?: boolean;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	canCauseAllergies?: boolean;

	@ApiPropertyOptional({ type: [String] })
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	allergens?: string[];

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	primaryPackaging?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	secondaryPackaging?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	packagingSpecification?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	netWeight?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	grossWeight?: string;

	@ApiPropertyOptional({ type: SuperfoodProductDimensionsDto })
	@ValidateNested()
	@Type(() => SuperfoodProductDimensionsDto)
	@IsOptional()
	dimensionsWithPackage?: SuperfoodProductDimensionsDto;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	storageConditions?: string;

	@ApiPropertyOptional({ minimum: 0 })
	@IsNumber()
	@Min(0)
	@IsOptional()
	estimatedDeliveryDays?: number;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isCustomizableOrMixable?: boolean;
}
