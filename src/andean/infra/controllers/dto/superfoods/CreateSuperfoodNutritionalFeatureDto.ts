import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodNutritionalFeatureDto {
	@ApiProperty({
		description: 'Nombre de la característica nutricional',
		example: 'Alto en proteínas',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description:
			'ID del MediaItem que representa el icono de la característica nutricional',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: false,
	})
	@IsString()
	@IsOptional()
	iconId?: string;
}
