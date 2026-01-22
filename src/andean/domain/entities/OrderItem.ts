export class OrderItem {
  constructor(
    public id: string,
    public orderId: string,
    public productId: string,
    public quantity: number,
    public price: number,
		public discount: number,
		public createdAt: Date,
		public updatedAt: Date,
		public variantProductId?: string,
  ) {}
}
