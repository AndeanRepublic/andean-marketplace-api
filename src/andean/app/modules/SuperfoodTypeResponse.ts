import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodTypeResponse {
	@ApiProperty({ description: 'ID único del tipo' })
	id: string;

	@ApiProperty({ description: 'Nombre del tipo', example: 'Grano' })
	name: string;

	@ApiProperty({ description: 'URL del icono', required: false })
	icon?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
