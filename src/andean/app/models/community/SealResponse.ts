import { ApiProperty } from '@nestjs/swagger';

export class SealResponse {
	@ApiProperty({
		description: 'ID único del sello',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre del sello de comunidad',
		example: 'Artesanía Certificada',
	})
	name: string;

	@ApiProperty({
		description: 'Descripción del sello',
		example: 'Sello que certifica la autenticidad artesanal del producto.',
	})
	description: string;

	@ApiProperty({
		description: 'ID del media item del logo del sello',
		example: '507f1f77bcf86cd799439022',
	})
	logoMediaId: string;

	@ApiProperty({
		description: 'URL pública del logo del sello',
		example: 'https://cdn.example.com/seals/logo.png',
		required: false,
	})
	logoUrl?: string;
}
