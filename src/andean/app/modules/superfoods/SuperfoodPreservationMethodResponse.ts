import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodPreservationMethodResponse {
	@ApiProperty({ description: 'ID único del método de preservación' })
	id: string;

	@ApiProperty({ description: 'Nombre del método', example: 'Deshidratado' })
	name: string;

	@ApiProperty({ description: 'URL del icono', required: false })
	icon?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
