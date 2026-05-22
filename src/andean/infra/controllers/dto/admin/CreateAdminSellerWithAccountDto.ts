import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '../../../../domain/enums/PersonType';

export class CreateAdminSellerWithAccountDto {
	@ApiProperty({
		description: 'Correo de la nueva cuenta',
		example: 'nuevo.vendedor@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		description: 'Contraseña de la nueva cuenta',
		example: 'SecurePass123!',
	})
	@IsString()
	@IsNotEmpty()
	password!: string;

	@ApiProperty({
		description: 'Nombre mostrado en la cuenta',
		example: 'María García',
	})
	@IsString()
	@IsNotEmpty()
	accountName!: string;

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
