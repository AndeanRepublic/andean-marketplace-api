import { ShopCategory } from '../enums/ShopCategory';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string,
		public name: string,
		public description: string,
		public categories: ShopCategory[],
		public policies: string,
		public shippingOrigin: string,
		public shippingArea: string,
	) {}
}
