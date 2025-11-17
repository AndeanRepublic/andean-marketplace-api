import { CartShop } from '../../domain/entities/CartShop';

export abstract class CartShopRepository {
  abstract addItem(
    customerId: string,
    productId: string,
    quantity: number,
  ): Promise<CartShop>;
  abstract removeItem(
    customerId: string,
    productId: string,
  ): Promise<CartShop | null>;
  abstract getCartByUser(customerId: string): Promise<CartShop | null>;
  abstract clearCart(customerId: string): Promise<void>;
}
