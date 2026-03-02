import { ProductType } from '../enums/ProductType';

export class Review {
	constructor(
		public id: string,
		public content: string,
		public numberStarts: number,
		public customerId: string,
		public productId: string,
		public productType: ProductType,
		public numberLikes: number,
		public numberDislikes: number,
		public createdAt: Date,
		public updatedAt: Date,
		public mediaId?: string,
	) { }
}
