import { ShopCategory } from '../enums/ShopCategory';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string,
		public name: string,
		public categories: ShopCategory[],
		public description?: string,
		public policies?: string,
		public shippingOrigin?: string,
		public shippingArea?: string,
		public providerInfoId?: string,
	) {}
}
