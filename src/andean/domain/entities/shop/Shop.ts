import { ShopCategory } from '../../enums/ShopCategory';
import { ShopStatus } from '../../enums/ShopStatus';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string | undefined,
		public name: string,
		public status: ShopStatus,
		public categories: ShopCategory[],
		public providerInfoId?: string,
		public artisanPhotoMediaId?: string,
		public seals?: string[],
	) {}
}
