import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoinType } from '../../../domain/enums/CoinType';

export class CreateCustomerDto {
	@ApiProperty({ description: 'Nombre completo del cliente', example: 'Juan Pérez' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: 'País de residencia', example: 'Perú' })
	@IsString()
	@IsNotEmpty()
	country: string;

	@ApiProperty({ description: 'Número de teléfono', example: '+51987654321' })
	@IsString()
	@IsNotEmpty()
	phoneNumber: string;

	@ApiProperty({ description: 'Correo electrónico', example: 'juan@example.com' })
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ description: 'Idioma preferido', example: 'es' })
	@IsString()
	@IsNotEmpty()
	language: string;

	@ApiProperty({
		description: 'Tipo de moneda preferida',
		enum: CoinType,
		example: CoinType.PEN
	})
	@IsEnum(CoinType)
	@IsNotEmpty()
	coin: CoinType;

	@ApiProperty({ description: 'Contraseña para la cuenta', example: 'SecurePass123!' })
	@IsString()
	@IsNotEmpty()
	password: string;
}
