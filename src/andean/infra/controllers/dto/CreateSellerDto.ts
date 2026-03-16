import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '../../../domain/enums/PersonType';

export class CreateSellerDto {
	@ApiPropertyOptional({
		description: 'ID del usuario existente (si ya tiene cuenta como cliente)',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsString()
	@IsOptional()
	userId?: string;

	@ApiProperty({
		description: 'Tipo de persona (natural o jurídica)',
		enum: PersonType,
		example: PersonType.NATURAL,
	})
	@IsEnum(PersonType)
	@IsNotEmpty()
	typePerson: PersonType;

	@ApiProperty({
		description: 'Número de documento (DNI/Pasaporte)',
		example: '12345678',
	})
	@IsString()
	@IsNotEmpty()
	numberDocument: string;

	@ApiPropertyOptional({
		description: 'RUC (solo para personas jurídicas)',
		example: '20123456789',
	})
	@IsString()
	@IsOptional()
	ruc?: string;

	@ApiProperty({
		description: 'Nombre legal del vendedor',
		example: 'María García',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Nombre comercial de la tienda',
		example: 'Textiles Andinos',
	})
	@IsString()
	@IsNotEmpty()
	commercialName: string;

	@ApiProperty({
		description: 'Dirección física',
		example: 'Av. Los Incas 123, Cusco',
	})
	@IsString()
	@IsNotEmpty()
	address: string;

	@ApiProperty({ description: 'Número de teléfono', example: '+51987654321' })
	@IsString()
	@IsNotEmpty()
	phoneNumber: string;

	@ApiPropertyOptional({
		description: 'Correo electrónico (requerido si no se proporciona userId)',
		example: 'maria@textiles.com',
	})
	@IsString()
	@IsOptional()
	email?: string;

	@ApiPropertyOptional({
		description:
			'Contraseña para la cuenta (requerido si no se proporciona userId)',
		example: 'SecurePass123!',
	})
	@IsString()
	@IsOptional()
	password?: string;
}
