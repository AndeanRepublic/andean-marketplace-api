import { ApiProperty } from '@nestjs/swagger';
import { SuperfoodProductListItem } from './SuperfoodProductListItem';
import { PaginationInfo } from '../../modules/PaginatedProductsResponse';

export class PaginatedSuperfoodProductsResponse {
	@ApiProperty({
		description: 'Lista de productos superfoods',
		type: [SuperfoodProductListItem],
	})
	products!: SuperfoodProductListItem[];

	@ApiProperty({
		description: 'Información de paginación',
		type: PaginationInfo,
	})
	pagination!: PaginationInfo;
}
