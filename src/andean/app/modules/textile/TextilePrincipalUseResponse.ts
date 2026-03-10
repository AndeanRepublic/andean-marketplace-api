import { ApiProperty } from '@nestjs/swagger';

export class TextilePrincipalUseResponse {
	@ApiProperty({
		description: 'ID único del uso principal',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre del uso principal del textil',
		example: 'Vestimenta ceremonial',
	})
	name: string;
}
