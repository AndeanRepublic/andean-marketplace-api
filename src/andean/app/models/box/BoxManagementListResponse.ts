import { ApiProperty } from '@nestjs/swagger';
import { BoxItemCountResponse } from './BoxListResponse';

export class BoxManagementListItemResponse {
	@ApiProperty({ description: 'ID del box', example: '6973d8ffddef7b59c2d4dcfb' })
	id!: string;

	@ApiProperty({ description: 'Nombre del box', example: 'Box Andino Premium' })
	name!: string;

	@ApiProperty({ description: 'Eslogan del box', example: 'Lo mejor de los Andes' })
	slogan!: string;

	@ApiProperty({ description: 'Precio final del box', example: 149.99 })
	price!: number;

	@ApiProperty({
		description: 'Conteo de productos por tipo',
		type: BoxItemCountResponse,
	})
	itemCount!: BoxItemCountResponse;

	@ApiProperty({
		description:
			'Cantidad de cajas armables (mínimo de stocks de los 3 componentes cuando hay exactamente 3 líneas con variantId)',
		example: 12,
	})
	fulfillableQuantity!: number;
}

export class BoxManagementListPaginatedResponse {
	@ApiProperty({
		description: 'Lista de boxes (admin / dashboard)',
		type: [BoxManagementListItemResponse],
	})
	data!: BoxManagementListItemResponse[];

	@ApiProperty({
		description: 'Información de paginación',
		example: { total: 25, page: 1, per_page: 10 },
	})
	pagination!: {
		total: number;
		page: number;
		per_page: number;
	};
}
