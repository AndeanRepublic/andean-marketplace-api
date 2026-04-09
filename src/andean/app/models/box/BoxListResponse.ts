import { ApiProperty } from '@nestjs/swagger';
import { BoxImageResponse } from './BoxImageResponse';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export class BoxItemCountResponse {
	@ApiProperty({ description: 'Cantidad de productos textiles', example: 1 })
	textiles!: number;

	@ApiProperty({ description: 'Cantidad de productos superfood', example: 2 })
	superfoods!: number;
}

export class BoxListItemResponse {
	@ApiProperty({
		description: 'ID único del box',
		example: '6973d8ffddef7b59c2d4dcfb',
	})
	id!: string;

	@ApiProperty({ description: 'Nombre del box', example: 'Box Andino Premium' })
	name!: string;

	@ApiProperty({
		description: 'Eslogan del box',
		example: 'Lo mejor de los Andes',
	})
	slogan!: string;

	@ApiProperty({ description: 'Estado del box', enum: AdminEntityStatus })
	status!: AdminEntityStatus;

	@ApiProperty({
		description: 'Conteo de productos por tipo',
		type: BoxItemCountResponse,
	})
	itemCount!: BoxItemCountResponse;

	@ApiProperty({
		description: 'Precio original (antes de descuento)',
		example: 199.99,
	})
	discartedPrice!: number;

	@ApiProperty({ description: 'Precio final del box', example: 149.99 })
	price!: number;

	@ApiProperty({ description: 'Porcentaje de descuento aplicado', example: 25 })
	porcentageDiscount!: number;

	@ApiProperty({
		description: 'Imagen miniatura del box',
		type: BoxImageResponse,
	})
	thumbnailImage!: BoxImageResponse;

	@ApiProperty({
		description:
			'Cantidad de cajas armables con el stock actual (mínimo de stocks de los 3 componentes)',
		example: 12,
	})
	fulfillableQuantity!: number;
}

export class BoxPaginationResponse {
	@ApiProperty({ description: 'Total de boxes disponibles', example: 25 })
	total!: number;

	@ApiProperty({ description: 'Página actual', example: 1 })
	page!: number;

	@ApiProperty({ description: 'Cantidad de boxes por página', example: 10 })
	per_page!: number;
}

export class BoxListPaginatedResponse {
	@ApiProperty({ description: 'Lista de boxes', type: [BoxListItemResponse] })
	data!: BoxListItemResponse[];

	@ApiProperty({
		description: 'Información de paginación',
		type: BoxPaginationResponse,
	})
	pagination!: BoxPaginationResponse;
}
