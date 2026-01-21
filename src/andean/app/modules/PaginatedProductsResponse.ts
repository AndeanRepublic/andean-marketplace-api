import { ApiProperty } from '@nestjs/swagger';
import { TextileProductListItem } from './TextileProductListItemResponse';

export class FilterCountItem {
	@ApiProperty({ description: 'Etiqueta del filtro', example: 'Rojo' })
	label: string;

	@ApiProperty({ description: 'Cantidad de productos con este filtro', example: 15 })
	count: number;
}

export class FilterCount {
	@ApiProperty({ description: 'Conteo por colores', type: [FilterCountItem], required: false })
	colors?: FilterCountItem[];

	@ApiProperty({ description: 'Conteo por tallas', type: [FilterCountItem], required: false })
	sizes?: FilterCountItem[];

	@ApiProperty({ description: 'Conteo por comunidades', type: [FilterCountItem], required: false })
	communities?: FilterCountItem[];

	@ApiProperty({ description: 'Conteo por categorías', type: [FilterCountItem], required: false })
	categories?: FilterCountItem[];
}

export class PaginationInfo {
	@ApiProperty({ description: 'Total de productos', example: 100 })
	total: number;

	@ApiProperty({ description: 'Página actual', example: 1 })
	page: number;

	@ApiProperty({ description: 'Productos por página', example: 10 })
	per_page: number;
}

export class PaginatedTextileProductsResponse {
	@ApiProperty({ description: 'Lista de productos textiles', type: [TextileProductListItem] })
	products: TextileProductListItem[];

	@ApiProperty({ description: 'Información de paginación', type: PaginationInfo })
	pagination: PaginationInfo;

	@ApiProperty({ description: 'Conteo de filtros disponibles', type: FilterCount, required: false })
	filterCount?: FilterCount;
}

// Generic interface for internal use
export interface PaginatedProductsResponse<T> {
	products: T[];
	pagination: {
		total: number;
		page: number;
		per_page: number;
	};
	filterCount?: FilterCount;
}

