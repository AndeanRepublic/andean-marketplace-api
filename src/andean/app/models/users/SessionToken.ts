import { ApiProperty } from '@nestjs/swagger';
import { CoinType } from '../../../domain/enums/CoinType';

export class SessionToken {
	@ApiProperty({
		description: 'Token JWT para autenticación',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	public token: string;

	@ApiProperty({
		description: 'Duración del token en segundos',
		example: 3600,
	})
	public duration: number;

	@ApiProperty({
		description: 'ID único del usuario',
		example: '507f1f77bcf86cd799439011',
	})
	public userId: string;

	@ApiProperty({
		description: 'Nombre del usuario',
		example: 'Juan Pérez',
	})
	public name: string;

	@ApiProperty({
		description: 'Email del usuario',
		example: 'juan@ejemplo.com',
	})
	public email: string;

	@ApiProperty({
		description: 'País del usuario',
		example: 'Perú',
	})
	public country: string;

	@ApiProperty({
		description: 'Número de teléfono del usuario',
		example: '+51987654321',
	})
	public phoneNumber: string;

	@ApiProperty({
		description: 'Idioma preferido del usuario',
		example: 'es',
	})
	public language: string;

	@ApiProperty({
		description: 'Moneda preferida del usuario',
		enum: CoinType,
		example: 'PEN',
	})
	public coin: CoinType;

	@ApiProperty({
		description: 'Fecha de nacimiento del usuario',
		example: '1990-01-15',
	})
	public birthDate: string;

	@ApiProperty({
		description: 'URL de la imagen de perfil del usuario',
		example: 'https://storage.example.com/media/123456.jpg',
	})
	public profilePictureUrl: string;

	constructor(
		token: string,
		duration: number,
		userId: string,
		name: string,
		email: string,
		country: string,
		phoneNumber: string,
		language: string,
		coin: CoinType,
		birthDate: string,
		profilePictureUrl: string,
	) {
		this.token = token;
		this.duration = duration;
		this.userId = userId;
		this.name = name;
		this.email = email;
		this.country = country;
		this.phoneNumber = phoneNumber;
		this.language = language;
		this.coin = coin;
		this.birthDate = birthDate;
		this.profilePictureUrl = profilePictureUrl;
	}
}
