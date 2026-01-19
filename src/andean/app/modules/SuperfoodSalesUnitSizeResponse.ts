import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodSalesUnitSizeResponse {
	@ApiProperty({ description: 'ID único del tamaño de unidad' })
	id: string;

	@ApiProperty({ description: 'Nombre del tamaño', example: '500g' })
	name: string;

	@ApiProperty({ description: 'URL del icono', required: false })
	icon?: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt: Date;
}
