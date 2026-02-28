import { CartShop } from '../../domain/entities/CartShop';

export abstract class CartShopRepository {
	abstract getCartByCustomerId(customerId: string): Promise<CartShop | null>;
	abstract getCartByCustomerEmail(
		customerEmail: string,
	): Promise<CartShop | null>;
	abstract getCartByIdentifier(
		customerId?: string,
		customerEmail?: string,
	): Promise<CartShop | null>;
	abstract getCartById(cartShopId: string): Promise<CartShop | null>;
	abstract createCart(cart: CartShop): Promise<CartShop>;
	abstract clearCart(
		customerId?: string,
		customerEmail?: string,
	): Promise<void>;
}
