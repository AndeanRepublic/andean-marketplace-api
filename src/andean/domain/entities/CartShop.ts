import { CartItem } from './CartItem';

export class CartShop {
  constructor(
    public id: string,
    public customerId: string,
    public items: CartItem[],
    public totalAmount: number,
  ) {}

  public getTotalAmount(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}
