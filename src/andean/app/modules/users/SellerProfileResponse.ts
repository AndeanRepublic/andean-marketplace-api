import { ApiProperty } from '@nestjs/swagger';
import { PersonType } from '../../../domain/enums/PersonType';

export class SellerProfileResponse {
	@ApiProperty({
		description: 'Identificador único del perfil del vendedor',
		example: '550e8400-e29b-41d4-a716-446655440001',
	})
	id: string;

	@ApiProperty({
		description: 'Identificador único del usuario asociado al vendedor',
		example: '123e4567-e89b-12d3-a456-426614174001',
	})
	userId: string;

	@ApiProperty({
		description: 'Nombre completo del vendedor o razón social',
		example: 'Juan Pérez',
	})
	name: string;

	@ApiProperty({
		description: 'Tipo de persona: Natural o Jurídica',
		enum: PersonType,
		example: PersonType.NATURAL,
	})
	typePerson: PersonType;

	@ApiProperty({
		description: 'Número de documento de identidad (DNI, CE, etc.)',
		example: '12345678',
	})
	numberDocument: string;

	@ApiProperty({
		description: 'Registro Único de Contribuyentes (RUC)',
		example: '20123456789',
	})
	ruc: string;

	@ApiProperty({
		description: 'Dirección física del negocio',
		example: 'Av. Los Artesanos 123, Cusco',
	})
	address: string;

	@ApiProperty({
		description: 'Número de teléfono del vendedor',
		example: '+51 984123456',
	})
	phoneNumber: string;
}
