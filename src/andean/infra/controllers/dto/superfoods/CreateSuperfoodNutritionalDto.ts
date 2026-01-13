import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodNutritionalDto {
	@ApiProperty({ description: 'Cantidad del nutriente', example: '20g' })
	@IsString()
	@IsNotEmpty()
	quantity: string;

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
