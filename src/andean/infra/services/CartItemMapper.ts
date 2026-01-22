import { CartShopItemDocument } from '../persistence/cartShopItem.schema';
import { CartItem } from '../../domain/entities/CartItem';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class CartItemMapper {
  static fromDocument(doc: CartShopItemDocument): CartItem {
		const plain = doc.toObject();
		return plainToInstance(CartItem, {
			id: plain._id.toString(),
			...plain,
		})
  }

  static toPersistence(cartItem: CartItem) {

		const plain = instanceToPlain(cartItem);
		const { id, _id, __v, ...updateData } = plain;
    return {
      ...updateData,
    };
  }
}
