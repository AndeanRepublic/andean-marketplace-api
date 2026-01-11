import { CartShopDocument } from '../persistence/cartShop.schema';
import { CartShop } from '../../domain/entities/CartShop';

export class CartShopMapper {
  static fromDocument(doc: CartShopDocument): CartShop {
    return new CartShop(doc.id, doc.userId);
  }

  static toPersistence(cart: CartShop) {
    return {
      _id: crypto.randomUUID(),
      id: cart.id,
      userId: cart.userId,
    };
  }
}
