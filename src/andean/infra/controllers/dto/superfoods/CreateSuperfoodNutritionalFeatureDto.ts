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
		description: 'URL del icono de la característica nutricional',
		example: 'https://example.com/icons/proteinas.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
