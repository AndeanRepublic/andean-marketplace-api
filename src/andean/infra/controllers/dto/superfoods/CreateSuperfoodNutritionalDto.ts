import {
	IsBoolean,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodNutritionalDto {
	@ApiProperty({ description: 'Cantidad numérica del nutriente', example: 20 })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	quantityNumber!: number;

	@ApiProperty({
		description: 'Unidad de la cantidad del nutriente',
		enum: ['g', 'mg', 'µg', 'kcal', 'cal', 'kJ'],
		example: 'g',
	})
	@IsIn(['g', 'mg', 'µg', 'kcal', 'cal', 'kJ'])
	@IsNotEmpty()
	quantityUnit!: 'g' | 'mg' | 'µg' | 'kcal' | 'cal' | 'kJ';

	@ApiProperty({ description: 'Nombre del nutriente', example: 'Proteína' })
	@IsString()
	@IsNotEmpty()
	nutrient: string;

	@ApiProperty({ description: 'Característica destacada' })
	@IsString()
	@IsNotEmpty()
	strikingFeature: string;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	selected?: boolean;
}
