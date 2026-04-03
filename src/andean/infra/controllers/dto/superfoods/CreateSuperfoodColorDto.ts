import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodColorDto {
	@ApiProperty({
		description: 'Nombre del color',
		example: 'Morado',
		minLength: 1,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Código hexadecimal del color',
		example: '#7c3aed',
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
		message: 'hexCodeColor must be a valid hex color (#RGB or #RRGGBB)',
	})
	hexCodeColor!: string;
}
