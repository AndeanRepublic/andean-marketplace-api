import { BoxImageResponse } from './BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';

export type BoxProductType = ProductType.SUPERFOOD | ProductType.TEXTILE;

export class BoxProductResponse {
	name!: string;
	community!: string;
	type!: BoxProductType;
	thumbnailImage!: BoxImageResponse;
}

export class BoxListItemResponse {
	id!: string;
	title!: string;
	subtitle!: string;
	itemCount!: {
		textiles: number;
		superfoods: number;
	};
	discartedPrice!: number;
	price!: number;
	porcentageDiscount!: number;
	thumbnailImage!: BoxImageResponse;
	products!: BoxProductResponse[];
}

export class BoxListPaginatedResponse {
	data!: BoxListItemResponse[];
	pagination!: {
		total: number;
		page: number;
		per_page: number;
	};
}
