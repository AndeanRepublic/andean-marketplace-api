import { IsNotEmpty, IsString, IsMongoId, Matches } from 'class-validator';
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
	name!: string;

	@ApiProperty({
		description: 'Descripción detallada del beneficio',
		example:
			'Este beneficio ayuda a mejorar la digestión gracias a sus propiedades naturales y alto contenido de fibra.',
		minLength: 10,
		maxLength: 500,
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'Color hexadecimal asociado al beneficio',
		example: '#22c55e',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
		message: 'hexCodeColor must be a valid hex color (#RGB or #RRGGBB)',
	})
	hexCodeColor!: string;

	@ApiProperty({
		description: 'ID del MediaItem que representa el icono del beneficio',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	iconId!: string;
}
