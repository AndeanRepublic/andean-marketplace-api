import { ShopCategory } from '../enums/ShopCategory';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string | undefined,
		public name: string,
		public categories: ShopCategory[],
		public description?: string,
		public providerInfoId?: string,
		public artisanPhotoMediaId?: string,
	) {}
}
