import { SuperfoodProductStatus } from '../../enums/SuperfoodProductStatus';
import { SuperfoodBasicInfo } from './SuperfoodBasicInfo';
import { SuperfoodDetailProduct } from './SuperfoodDetailProduct';
import { SuperfoodPriceInventory } from './SuperfoodPriceInventory';
import { SuperfoodNutritionalItem } from './SuperfoodNutritionalItem';
import { SuperfoodDetailTraceability } from './SuperfoodDetailTraceability';
import { SuperfoodOptions } from './SuperfoodOptions';
import { SuperfoodVariant } from './SuperfoodVariant';
import { ProductTraceability } from '../ProductTraceability';

export class SuperfoodProduct {
	constructor(
		public id: string,
		public categoryId: string,  // Reference to SuperfoodCategories
		public status: SuperfoodProductStatus,
		public baseInfo: SuperfoodBasicInfo,
		public priceInventory: SuperfoodPriceInventory,
		public detailProduct: SuperfoodDetailProduct,
		public nutritionalContent: SuperfoodNutritionalItem[],
		public detailTraceability: SuperfoodDetailTraceability,
		public productTraceability: ProductTraceability,  // General traceability (shared with textiles)
		public options: SuperfoodOptions[],               // Product options (e.g., color, size)
		public variants: SuperfoodVariant[],              // Product variants with specific combinations
		public createdAt: Date,
		public updatedAt: Date,
	) { }
}
