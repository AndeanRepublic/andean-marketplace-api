import { ProductCurrency } from '../../enums/ProductCurrency';

export class SuperfoodPriceInventory {
	constructor(
		public basePrice: number,
		public totalStock: number,
		public currency: ProductCurrency,
		public SKU?: string,
	) {}
}
