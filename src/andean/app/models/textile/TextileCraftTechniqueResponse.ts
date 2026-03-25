import { ApiProperty } from '@nestjs/swagger';

export class TextileCraftTechniqueResponse {
	@ApiProperty({
		description: 'ID único de la técnica de elaboración',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Nombre de la técnica artesanal',
		example: 'Tejido a telar',
	})
	name: string;
}
