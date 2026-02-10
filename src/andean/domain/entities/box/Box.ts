export class BoxProduct {
	constructor(
		public productId?: string,
		public variantId?: string,
	) { }
}

export class Box {
	constructor(
		public id: string,
		public title: string,
		public subtitle: string,
		public description: string,
		public thumbnailImageId: string,
		public mainImageId: string,
		public products: BoxProduct[],
		public price: number,
		public sealIds: string[],
		public createdAt: Date,
		public updatedAt: Date,
	) { }
}
