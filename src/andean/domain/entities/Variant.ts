import { ProductType } from '../enums/ProductType';

/**
 * Variant entity for textile and superfood products.
 * This entity represents a specific combination of options (color, size, etc.)
 * with its own price and stock.
 */
export class Variant {
	constructor(
		public id: string,
		public productId: string,
		public productType: ProductType,
		public combination: Record<string, string>,
		public price: number,
		public stock: number,
		public createdAt: Date,
		public updatedAt: Date,
		public sku?: string,
	) {}
}
