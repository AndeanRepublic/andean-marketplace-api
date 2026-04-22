import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CoinType } from '../../../domain/enums/CoinType';

export class CustomerProfileResponse {
	@ApiProperty({
		description: 'Identificador único del perfil del cliente',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id!: string;

	@ApiProperty({
		description: 'Identificador único del usuario asociado al cliente',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	userId!: string;

	@ApiPropertyOptional({
		description: 'País de residencia del cliente',
		example: 'Perú',
	})
	country?: string;

	@ApiPropertyOptional({
		description: 'Número de teléfono del cliente',
		example: '+51 987654321',
	})
	phoneNumber?: string;

	@ApiPropertyOptional({
		description: 'Idioma preferido del cliente',
		example: 'es',
	})
	language?: string;

	@ApiPropertyOptional({
		description: 'Tipo de moneda preferida del cliente',
		enum: CoinType,
		example: CoinType.PEN,
	})
	coin?: CoinType;

	@ApiPropertyOptional({
		description: 'Fecha de nacimiento del cliente',
		example: '1990-01-15',
	})
	birthDate?: Date;

	@ApiPropertyOptional({
		description: 'ID del MediaItem de la foto de perfil',
	})
	profilePictureMediaId?: string;
}
