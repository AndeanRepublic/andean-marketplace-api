import { ProductType } from '../enums/ProductType';

export interface StockReductionItem {
	productType: ProductType;
	productId: string;
	quantity: number;
	variantId?: string;
}
