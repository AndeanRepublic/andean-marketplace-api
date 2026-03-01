import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CoinType } from '../../../domain/enums/CoinType';

export class CreateCustomerDto {
	@ApiPropertyOptional({ description: 'País de residencia', example: 'Perú' })
	@IsString()
	@IsOptional()
	country?: string;

	@ApiPropertyOptional({ description: 'Número de teléfono', example: '+51987654321' })
	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@ApiProperty({
		description: 'Correo electrónico',
		example: 'juan@example.com',
	})
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		description: 'Nombre completo del cliente',
		example: 'Juan Pérez',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiPropertyOptional({ description: 'Idioma preferido', example: 'es' })
	@IsString()
	@IsOptional()
	language?: string;

	@ApiPropertyOptional({
		description: 'Tipo de moneda preferida',
		enum: CoinType,
		example: CoinType.PEN,
	})
	@IsEnum(CoinType)
	@IsOptional()
	coin?: CoinType;

	@ApiPropertyOptional({
		description: 'Fecha de nacimiento',
		example: '1990-01-15',
	})
	@IsDateString()
	@IsOptional()
	birthDate?: string;

	@ApiPropertyOptional({
		description: 'ID del MediaItem de la foto de perfil',
	})
	@IsString()
	@IsOptional()
	profilePictureMediaId?: string;

	@ApiProperty({
		description: 'Contraseña para la cuenta',
		example: 'SecurePass123!',
	})
	@IsString()
	@IsNotEmpty()
	password!: string;
}
