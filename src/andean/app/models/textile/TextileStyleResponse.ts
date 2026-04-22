import { ApiProperty } from '@nestjs/swagger';

export class TextileStyleResponse {
	@ApiProperty({
		description: 'ID único del estilo textil',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre del estilo textil',
		example: 'Tradicional',
	})
	name: string;
}
