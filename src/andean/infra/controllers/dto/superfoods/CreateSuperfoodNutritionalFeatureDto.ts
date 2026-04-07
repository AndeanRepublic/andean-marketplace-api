import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
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
	name!: string;

	@ApiProperty({
		description:
			'ID del MediaItem que representa el icono de la característica nutricional',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	iconId!: string;
}
