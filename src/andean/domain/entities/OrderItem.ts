export class OrderItem {
  constructor(
    public id: string,
    public userId: string,
    public orderId: string,
    public productId: string,
    public variantProductId: string,
    public quantity: number,
    public price: number,
  ) {}
}
