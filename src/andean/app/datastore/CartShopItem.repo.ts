import { CartItem } from '../../domain/entities/CartItem';

export abstract class CartShopItemRepository {
  abstract getItemsByCartId(cartId: string): Promise<CartItem[]>;
  abstract getItemsByUserId(userId: string): Promise<CartItem[]>;
  abstract createItem(item: CartItem): Promise<CartItem>;
  abstract deleteItem(itemId: string): Promise<void>;
  abstract deleteItemsByUserId(userId: string): Promise<void>;
}
