import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '../../../../domain/enums/PersonType';

/** Datos del formulario de vendedor (sin userId; viene del JWT). */
export class SellerApplicationProfileDto {
	@ApiProperty({
		description: 'Tipo de persona (natural o jurídica)',
		enum: PersonType,
		example: PersonType.NATURAL,
	})
	@IsEnum(PersonType)
	@IsNotEmpty()
	typePerson!: PersonType;

	@ApiProperty({
		description: 'Número de documento (DNI/Pasaporte)',
		example: '12345678',
	})
	@IsString()
	@IsNotEmpty()
	numberDocument!: string;

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
	name!: string;

	@ApiProperty({
		description: 'Dirección física',
		example: 'Av. Los Incas 123, Cusco',
	})
	@IsString()
	@IsNotEmpty()
	address!: string;

	@ApiProperty({ description: 'Número de teléfono', example: '+51987654321' })
	@IsString()
	@IsNotEmpty()
	phoneNumber!: string;
}
