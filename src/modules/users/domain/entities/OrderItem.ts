export class OrderItem {
  constructor(
    public productId: string,
    public quantity: number,
    public price: number,
    public sellerId: string,
  ) {}
}
