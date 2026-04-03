import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuperfoodConsumptionWay } from '../../../../domain/enums/SuperfoodConsumptionWay';

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
}
