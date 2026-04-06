import { ShopCategory } from '../enums/ShopCategory';
import { AdminEntityStatus } from '../enums/AdminEntityStatus';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string | undefined,
		public name: string,
		public status: AdminEntityStatus,
		public categories: ShopCategory[],
		public providerInfoId?: string,
		public artisanPhotoMediaId?: string,
	) {}
}
