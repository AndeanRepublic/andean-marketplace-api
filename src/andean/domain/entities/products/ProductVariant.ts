import { ProductStatus } from '../../enums/ProductStatus';
import { TimeModel } from './TimeModel';

export class ProductVariant {
	constructor(
		public id: string,
		public productId: string,
		public title: string,
		public description: string,
		public price: number,
		public attributes: any,
		public stock: number,
		public photos: string[],
		public status: ProductStatus,
		public shippingTime: TimeModel,
		public timeGuarantee: TimeModel,
	) {}
}
