import { ApiProperty } from '@nestjs/swagger';

export class OriginProductCommunityResponse {
	@ApiProperty({
		description: 'ID único de la comunidad',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la comunidad',
		example: 'Comunidad de Pisac',
	})
	name: string;

	@ApiProperty({
		description: 'ID de la región a la que pertenece',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	regionId: string;

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
