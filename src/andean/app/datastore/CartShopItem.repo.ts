import { CartItem } from '../../domain/entities/CartItem';

export abstract class CartShopItemRepo {
  abstract createItem(item: CartItem): Promise<CartItem>;
  abstract deleteItem(itemId: string): Promise<void>;
}
