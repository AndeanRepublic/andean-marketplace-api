import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
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
	@ApiProperty({ description: 'ID de tipo de superfood' })
	@IsString()
	@IsNotEmpty()
	type: string;

	@ApiProperty({ description: 'ID de presentación del producto' })
	@IsString()
	@IsNotEmpty()
	productPresentation: string;

	@ApiProperty({ enum: SuperfoodConsumptionWay })
	@IsEnum(SuperfoodConsumptionWay)
	@IsNotEmpty()
	consumptionWay: SuperfoodConsumptionWay;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	consumptionSuggestions?: string;

	@ApiProperty({ description: 'ID de tamaño de unidad de venta' })
	@IsString()
	@IsNotEmpty()
	salesUnitSize: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	medicRecommendations?: string;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	healthWarnings?: string;

	@ApiProperty({ type: CreateElaborationTimeDto })
	@ValidateNested()
	@Type(() => CreateElaborationTimeDto)
	elaborationTime: CreateElaborationTimeDto;

	@ApiProperty()
	@IsBoolean()
	handmade: boolean;

	@ApiProperty({ type: [String], required: false })
	@IsOptional()
	secondaryMaterials?: string[];

	@ApiProperty({ description: 'ID de la comunidad de origen del producto' })
	@IsString()
	@IsNotEmpty()
	originProductCommunityId: string;

	@ApiProperty({ enum: SuperfoodProductionMethod })
	@IsEnum(SuperfoodProductionMethod)
	productionMethod: SuperfoodProductionMethod;

	@ApiProperty({ description: 'ID de método de preservación' })
	@IsString()
	@IsNotEmpty()
	preservationMethod: string;

	@ApiProperty()
	@IsBoolean()
	isArtesanal: boolean;

	@ApiProperty()
	@IsBoolean()
	isNatural: boolean;

	@ApiProperty()
	@IsBoolean()
	isEatableWithoutPrep: boolean;

	@ApiProperty()
	@IsBoolean()
	canCauseAllergies: boolean;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	certification?: string;
}
