import { ApiProperty } from '@nestjs/swagger';

export class BoxSealResponse {
	@ApiProperty({
		description: 'ID único del sello de box',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre del sello',
		example: 'Comercio Justo',
	})
	name: string;

	@ApiProperty({
		description: 'Descripción del sello',
		example:
			'Certificación que garantiza condiciones laborales dignas y precios justos para los productores.',
	})
	description: string;

	@ApiProperty({
		description: 'ID del media item del logo del sello',
		example: '507f1f77bcf86cd799439022',
	})
	logoMediaId: string;

	@ApiProperty({
		description: 'Fecha de creación',
		example: '2024-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Fecha de última actualización',
		example: '2024-01-01T00:00:00.000Z',
	})
	updatedAt: Date;
}
