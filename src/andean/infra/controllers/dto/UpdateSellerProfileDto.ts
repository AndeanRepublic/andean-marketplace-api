import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '../../../domain/enums/PersonType';

export class UpdateSellerProfileDto {
	@ApiProperty({
		description: 'Nombre completo del vendedor',
		example: 'María Quispe',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Número de teléfono del vendedor',
		example: '+51987654321',
	})
	@IsString()
	@IsNotEmpty()
	phoneNumber: string;

	@ApiProperty({
		description: 'Número de documento de identidad',
		example: '12345678',
	})
	@IsString()
	@IsNotEmpty()
	numberDocument: string;

	@ApiPropertyOptional({
		description: 'RUC del vendedor (para personas jurídicas)',
		example: '20123456789',
	})
	@IsString()
	ruc: string;

	@ApiProperty({
		description: 'Tipo de persona (natural o jurídica)',
		enum: PersonType,
		example: PersonType.NATURAL,
	})
	@IsEnum(PersonType)
	@IsNotEmpty()
	typePerson: PersonType;

	@ApiProperty({ description: 'País del vendedor', example: 'Peru' })
	@IsString()
	@IsNotEmpty()
	country: string;

	@ApiProperty({
		description: 'Nombre comercial del vendedor',
		example: 'Artesanías Andinas',
	})
	@IsString()
	@IsNotEmpty()
	commercialName: string;

	@ApiProperty({
		description: 'Dirección del vendedor',
		example: 'Av. El Sol 123, Cusco',
	})
	@IsString()
	@IsNotEmpty()
	address: string;
}
