import { CarProduct } from './CarProduct';

export class CarShop {
  constructor(
    public id: string,
    public userId: string,
    public products: CarProduct[],
  ) {}

  public getTotalAmount(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  }
}
