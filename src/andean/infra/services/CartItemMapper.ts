import { CartShopItemDocument } from '../persistence/cartShopItem.schema';
import { CartItem } from '../../domain/entities/CartItem';

export class CartItemMapper {
  static toDomain(doc: CartShopItemDocument): CartItem {
    return new CartItem(
      doc.id,
      doc.userId,
      doc.cartId,
      doc.productId,
      doc.variantProductId,
      doc.quantity,
      doc.unitPrice,
    );
  }

  static toPersistence(cartItem: CartItem) {
    return {
      _id: crypto.randomUUID(),
      id: cartItem.id,
      userId: cartItem.userId,
      cartId: cartItem.cartId,
      productId: cartItem.productId,
      variantProductId: cartItem.variantProductId,
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
    };
  }
}
