import { ShopCategory } from '../../enums/ShopCategory';
import { ShopStatus } from '../../enums/ShopStatus';

export class Shop {
	constructor(
		public id: string,
		public sellerId: string | undefined,
		public name: string,
		public status: ShopStatus,
		public categories: ShopCategory[],
		public imageOrIconMediaId: string,
		public providerInfoId?: string,
		public seals?: string[],
		public activePage: boolean = false,
		public pageInfoId?: string,
		public founderInfoId?: string,
		public hasBranding: boolean = true,
	) {}
}
