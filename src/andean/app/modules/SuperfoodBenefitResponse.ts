import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodBenefitResponse {
	@ApiProperty({ description: 'ID único del beneficio' })
	id: string;

	@ApiProperty({ description: 'Nombre del beneficio', example: 'Mejora la digestión' })
	name: string;

	@ApiProperty({ description: 'ID del MediaItem que representa el icono', required: false })
	iconId?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
