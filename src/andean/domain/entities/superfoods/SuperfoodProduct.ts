import { SuperfoodProductStatus } from '../../enums/SuperfoodProductStatus';
import { SuperfoodBasicInfo } from './SuperfoodBasicInfo';
import { SuperfoodDetailProduct } from './SuperfoodDetailProduct';
import { SuperfoodPriceInventory } from './SuperfoodPriceInventory';
import { SuperfoodServingNutrition } from './SuperfoodServingNutrition';
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

		/** Referencia a documento en colección de catálogo `SuperfoodColor`. */
		public colorId?: string,
		public detailSourceProductId?: string, // Reference to DetailSourceProduct
		public categoryId?: string, // Reference to SuperfoodCategories
		public detailProduct?: SuperfoodDetailProduct,
		public servingNutrition?: SuperfoodServingNutrition,
		public detailTraceability?: SuperfoodDetailTraceability,
		public productTraceability?: ProductTraceability,
		public options?: SuperfoodOptions[], // Product options (e.g., color, size)
	) {}
}
