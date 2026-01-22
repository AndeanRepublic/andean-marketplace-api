import { CartItem } from '../../domain/entities/CartItem';

export abstract class CartShopItemRepository {
  abstract getItemsByCartShopId(cartShopId: string): Promise<CartItem[]>;
  abstract getItemsByCustomerId(customerId: string): Promise<CartItem[]>;
	abstract createItem(item: CartItem): Promise<CartItem>;
  abstract deleteItem(itemId: string): Promise<void>;
  abstract deleteItemsByCartShopId(cartShopId: string): Promise<void>;
}
