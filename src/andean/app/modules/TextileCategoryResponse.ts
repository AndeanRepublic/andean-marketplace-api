import { ApiProperty } from '@nestjs/swagger';
import { TextileCategoryStatus } from '../../domain/enums/TextileCategoryStatus';

export class TextileCategoryResponse {
	@ApiProperty({
		description: 'ID único de la categoría textil',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la categoría textil',
		example: 'Ponchos',
	})
	name: string;

	@ApiProperty({
		description: 'Estado de la categoría',
		enum: TextileCategoryStatus,
		example: TextileCategoryStatus.ENABLED,
	})
	status: TextileCategoryStatus;
}
