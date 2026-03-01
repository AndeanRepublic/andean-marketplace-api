import { ProductType } from '../enums/ProductType';

export class CartItem {
	constructor(
		public id: string,
		public cartShopId: string,
		public productType: ProductType,
		public productId: string,
		public quantity: number,
		public unitPrice: number,
		public discount: number,
		public createdAt: Date,
		public updatedAt: Date,

		public variantProductId?: string,
	) {}
}
