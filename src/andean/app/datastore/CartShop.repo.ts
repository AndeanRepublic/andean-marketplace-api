import { CartShop } from '../../domain/entities/CartShop';

export abstract class CartShopRepository {
	abstract getCartByCustomerId(customerId: string): Promise<CartShop | null>;
	abstract createCart(cart: CartShop): Promise<CartShop>;
	abstract clearCart(customerId: string): Promise<void>;
}
