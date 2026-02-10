import { BoxImageResponse } from './BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';

export type BoxProductType = ProductType.SUPERFOOD | ProductType.TEXTILE;

export class BoxDetailHeroResponse {
	title!: string;
	subtitle!: string;
	thumbnailImage!: BoxImageResponse;
	mainImage!: BoxImageResponse;
}

export class BoxDetailDescriptionResponse {
	description!: string;
	images!: BoxImageResponse[];
}

export class BoxContainedProductResponse {
	id!: string;
	title!: string;
	thumbnailImage!: BoxImageResponse;
	information!: string;
	type!: BoxProductType;
	discartedPrice!: number;
	price!: number;
}

export class BoxPriceDetailResponse {
	discartedPrice!: number;
	totalPrice!: number;
	discountPorcentage!: number;
}

export class BoxSealDetailResponse {
	name!: string;
	description!: string;
	logo!: BoxImageResponse;
}

export class BoxDetailResponse {
	id!: string;
	heroDetail!: BoxDetailHeroResponse;
	detail!: BoxDetailDescriptionResponse;
	containedProducts!: BoxContainedProductResponse[];
	priceDetail!: BoxPriceDetailResponse;
	boxSeals!: BoxSealDetailResponse[];
}
