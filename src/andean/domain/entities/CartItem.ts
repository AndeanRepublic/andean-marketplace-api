export class CartItem {
  constructor(
    public id: string,
    public userId: string,
    public cartId: string,
    public productId: string,
    public variantProductId: string,
    public quantity: number,
    public unitPrice: number,
  ) {}
}
