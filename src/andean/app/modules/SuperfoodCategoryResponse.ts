import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodCategoryResponse {
	@ApiProperty({ description: 'ID único de la categoría' })
	id: string;

	@ApiProperty({ description: 'Nombre de la categoría', example: 'Quinua' })
	name: string;

	@ApiProperty({ description: 'Estado de la categoría', enum: ['ENABLED', 'DISABLED'] })
	status: 'ENABLED' | 'DISABLED';

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
