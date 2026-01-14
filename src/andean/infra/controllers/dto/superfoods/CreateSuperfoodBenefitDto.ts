import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodBenefitDto {
	@ApiProperty({
		description: 'Nombre del beneficio',
		example: 'Mejora la digestión',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono del beneficio',
		example: 'https://example.com/icons/digestion.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
