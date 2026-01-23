import { ProductStatus } from '../../enums/ProductStatus';
import { TimeModel } from './TimeModel';

export class Product {
	constructor(
		public id: string,
		public shopId: string,
		public userId: string,
		public title: string,
		public description: string,
		public category: string,
		public basePrice: number,
		public origin: string,
		public photos: string[],
		public attributes: any,
		public stock: number,
		public status: ProductStatus,
		public shippingTime: TimeModel,
		public timeGuarantee: TimeModel,
	) {}
}
