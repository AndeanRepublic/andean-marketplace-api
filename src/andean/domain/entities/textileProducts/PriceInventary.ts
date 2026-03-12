import { ProductCurrency } from '../../enums/ProductCurrency';

export class PriceInventary {
	constructor(
		public basePrice: number,
		public totalStock: number,
		public currency: ProductCurrency,
		public SKU?: string,
	) {}
}
