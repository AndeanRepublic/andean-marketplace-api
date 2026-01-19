import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodPreservationMethodDto {
	@ApiProperty({
		description: 'Nombre del método de preservación',
		example: 'Deshidratado',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono del método de preservación',
		example: 'https://example.com/icons/deshidratado.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;
}
