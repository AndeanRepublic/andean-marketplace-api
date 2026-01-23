export class CartShop {
	constructor(
		public id: string,
		public customerId: string,
		public deliveryCost: number,
		public discount: number,
		public taxOrFee: number,
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}
