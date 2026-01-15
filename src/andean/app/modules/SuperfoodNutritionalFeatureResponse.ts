import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodNutritionalFeatureResponse {
	@ApiProperty({ description: 'ID único de la característica nutricional' })
	id: string;

	@ApiProperty({ description: 'Nombre de la característica', example: 'Alto en proteínas' })
	name: string;

	@ApiProperty({ description: 'ID del MediaItem que representa el icono', required: false })
	iconId?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
