import { ApiProperty } from '@nestjs/swagger';

export class TextileCertificationResponse {
	@ApiProperty({
		description: 'ID único de la certificación textil',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la certificación',
		example: 'Comercio Justo',
	})
	name: string;

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
