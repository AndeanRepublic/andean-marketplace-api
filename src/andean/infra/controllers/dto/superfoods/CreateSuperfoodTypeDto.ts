import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodTypeDto {
	@ApiProperty({
		description: 'Nombre del tipo de superfood',
		example: 'Grano',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono del tipo',
		example: 'https://example.com/icons/grano.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
