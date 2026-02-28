import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodConsumptionWay } from '../../../../domain/enums/SuperfoodConsumptionWay';
import { SuperfoodProductionMethod } from '../../../../domain/enums/SuperfoodProductionMethod';

export class CreateElaborationTimeDto {
	@ApiProperty()
	@IsNumber()
	days: number;

	@ApiProperty()
	@IsNumber()
	hours: number;
}

export class CreateSuperfoodDetailDto {
	@ApiProperty({ description: 'ID de tipo de superfood', required: false })
	@IsString()
	@IsOptional()
	type?: string;

	@ApiProperty({
		description: 'ID de presentación del producto',
		required: false,
	})
	@IsString()
	@IsOptional()
	productPresentation?: string;

	@ApiProperty({ enum: SuperfoodConsumptionWay, required: false })
	@IsEnum(SuperfoodConsumptionWay)
	@IsOptional()
	consumptionWay?: SuperfoodConsumptionWay;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	consumptionSuggestions?: string;

	@ApiProperty({
		description: 'ID de tamaño de unidad de venta',
		required: false,
	})
	@IsString()
	@IsOptional()
	salesUnitSize?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	medicRecommendations?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	healthWarnings?: string;

	@ApiProperty({ type: CreateElaborationTimeDto, required: false })
	@ValidateNested()
	@Type(() => CreateElaborationTimeDto)
	@IsOptional()
	elaborationTime?: CreateElaborationTimeDto;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	handmade?: boolean;

	@ApiProperty({ type: [String], required: false })
	@IsOptional()
	secondaryMaterials?: string[];

	@ApiProperty({
		description: 'ID de la comunidad de origen del producto',
		required: false,
	})
	@IsString()
	@IsOptional()
	originProductCommunityId?: string;

	@ApiProperty({ enum: SuperfoodProductionMethod, required: false })
	@IsEnum(SuperfoodProductionMethod)
	@IsOptional()
	productionMethod?: SuperfoodProductionMethod;

	@ApiProperty({ description: 'ID de método de preservación', required: false })
	@IsString()
	@IsOptional()
	preservationMethod?: string;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	isArtesanal?: boolean;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	isNatural?: boolean;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	isEatableWithoutPrep?: boolean;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	canCauseAllergies?: boolean;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	certification?: string;
}
