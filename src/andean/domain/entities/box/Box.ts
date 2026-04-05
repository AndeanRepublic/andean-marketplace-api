import { BoxProductType } from '../../enums/BoxProductType';

export class BoxProduct {
	constructor(
		public productType?: BoxProductType,
		public productId?: string,
		public variantId?: string,
		public boxPrice?: number,
		public narrativeImgId?: string,
	) {}
}

export class Box {
	constructor(
		public id: string,
		public name: string,
		public slogan: string,
		public narrative: string,
		public thumbnailImageId: string,
		public mainImageId: string,
		public products: BoxProduct[],
		public price: number,
		public discountPercentage: number | undefined,
		public sealIds: string[],
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}
