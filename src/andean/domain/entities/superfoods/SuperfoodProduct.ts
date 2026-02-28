import { SuperfoodProductStatus } from '../../enums/SuperfoodProductStatus';
import { SuperfoodColor } from '../../enums/SuperfoodColor';
import { SuperfoodBasicInfo } from './SuperfoodBasicInfo';
import { SuperfoodDetailProduct } from './SuperfoodDetailProduct';
import { SuperfoodPriceInventory } from './SuperfoodPriceInventory';
import { SuperfoodNutritionalItem } from './SuperfoodNutritionalItem';
import { SuperfoodDetailTraceability } from './SuperfoodDetailTraceability';
import { SuperfoodOptions } from './SuperfoodOptions';
import { ProductTraceability } from '../ProductTraceability';

export class SuperfoodProduct {
	constructor(
		public id: string,
		public status: SuperfoodProductStatus,
		public baseInfo: SuperfoodBasicInfo,
		public priceInventory: SuperfoodPriceInventory,
		public createdAt: Date,
		public updatedAt: Date,
		public isDiscountActive: boolean,

		public color?: SuperfoodColor,
		public detailSourceProductId?: string, // Reference to DetailSourceProduct
		public categoryId?: string, // Reference to SuperfoodCategories
		public detailProduct?: SuperfoodDetailProduct,
		public nutritionalContent?: SuperfoodNutritionalItem[],
		public detailTraceability?: SuperfoodDetailTraceability,
		public productTraceability?: ProductTraceability,
		public options?: SuperfoodOptions[], // Product options (e.g., color, size)
	) {}
}
