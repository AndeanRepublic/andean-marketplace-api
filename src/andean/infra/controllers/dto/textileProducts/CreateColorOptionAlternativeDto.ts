import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorOptionAlternativeDto {
	@ApiProperty({
		description: 'Nombre descriptivo del color',
		example: 'Rojo Carmesí',
		minLength: 2,
		maxLength: 50,
	})
	@IsString()
	@IsNotEmpty()
	nameLabel: string;

	@ApiProperty({
		description: 'Código hexadecimal del color',
		example: '#C41E3A',
		pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
	})
	@IsString()
	@IsNotEmpty()
	hexCode: string;
}
