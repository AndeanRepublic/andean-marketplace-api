import { ApiProperty } from '@nestjs/swagger';
import { ExperienceCategoryStatus } from '../../../domain/enums/ExperienceCategoryStatus';

export class ExperienceCategoryResponse {
	@ApiProperty({ description: 'ID único de la categoría' })
	id!: string;

	@ApiProperty({
		description: 'Nombre de la categoría',
		example: 'Adventure Tourism',
	})
	name!: string;

	@ApiProperty({
		description: 'Estado de la categoría',
		enum: ExperienceCategoryStatus,
	})
	status!: ExperienceCategoryStatus;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt!: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt!: Date;
}
