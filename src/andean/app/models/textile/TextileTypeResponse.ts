import { ApiProperty } from '@nestjs/swagger';

export class TextileTypeResponse {
	@ApiProperty({
		description: 'ID único del tipo de textil',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre del tipo de textil',
		example: 'Lana de Alpaca',
	})
	name: string;
}
