import { ApiProperty } from '@nestjs/swagger';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export class CommunityResponse {
	@ApiProperty({
		description: 'ID único de la comunidad',
		example: '550e8400-e29b-41d4-a716-446655440000',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la comunidad',
		example: 'Comunidad Artesanal de Cusco',
	})
	name: string;

	@ApiProperty({
		description: 'Fecha de creación',
		example: '2026-01-13T10:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({ description: 'Estado de la comunidad', enum: AdminEntityStatus })
	status: AdminEntityStatus;

	@ApiProperty({
		description: 'Fecha de última actualización',
		example: '2026-01-13T10:00:00.000Z',
	})
	updatedAt: Date;
}
