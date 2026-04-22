import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperfoodCertificationDto {
	@ApiProperty({
		description: 'Nombre de la certificación',
		example: 'Orgánico',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del icono de la certificación',
		example: 'https://example.com/icons/organico.svg',
		required: false,
	})
	@IsString()
	@IsOptional()
	icon?: string;

	@ApiProperty({
		description: 'Entidad certificadora',
		example: 'USDA Organic',
		required: false,
	})
	@IsString()
	@IsOptional()
	certifyingEntity?: string;
}
