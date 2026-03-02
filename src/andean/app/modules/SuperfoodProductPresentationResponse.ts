import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodProductPresentationResponse {
	@ApiProperty({ description: 'ID único de la presentación' })
	id: string;

	@ApiProperty({
		description: 'Nombre de la presentación',
		example: 'En polvo',
	})
	name: string;

	@ApiProperty({ description: 'URL del icono', required: false })
	icon?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
