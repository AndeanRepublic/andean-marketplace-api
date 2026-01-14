import { ApiProperty } from '@nestjs/swagger';

export class OriginProductRegionResponse {
	@ApiProperty({
		description: 'ID único de la región',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la región',
		example: 'Cusco',
	})
	name: string;

	@ApiProperty({
		description: 'Fecha de creación',
		example: '2026-01-13T10:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Fecha de última actualización',
		example: '2026-01-13T10:00:00.000Z',
	})
	updatedAt: Date;
}
