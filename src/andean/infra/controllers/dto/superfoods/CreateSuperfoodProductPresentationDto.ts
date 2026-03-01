import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodProductPresentationDto {
	@ApiProperty({
		description: 'Nombre de la presentación del producto',
		example: 'En polvo',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono de la presentación',
		example: 'https://example.com/icons/polvo.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
