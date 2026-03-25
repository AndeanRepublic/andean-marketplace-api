import { ProductType } from '../../../domain/enums/ProductType';

export interface StockReductionItem {
	productType: ProductType;
	productId: string;
	quantity: number;
	variantId?: string;
}
