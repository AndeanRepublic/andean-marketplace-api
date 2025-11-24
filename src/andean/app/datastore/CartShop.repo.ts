import { CartShop } from '../../domain/entities/CartShop';

export abstract class CartShopRepository {
  abstract getCartByUser(customerId: string): Promise<CartShop | null>;
  abstract clearCart(customerId: string): Promise<void>;
}
