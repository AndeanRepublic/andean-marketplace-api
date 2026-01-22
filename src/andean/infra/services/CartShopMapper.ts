import { CartShopDocument } from '../persistence/cartShop.schema';
import { CartShop } from '../../domain/entities/CartShop';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class CartShopMapper {
  static fromDocument(doc: CartShopDocument): CartShop {
		const plain = doc.toObject();
		return plainToInstance(CartShop, {
			id: plain._id.toString(),
			...plain,
		})
  }

  static toPersistence(cart: CartShop | Partial<CartShop>) {
		const plain = instanceToPlain(cart);
		const { id, _id, __v, ...updateData } = plain;
    return {
			...updateData,
		};
  }
}
