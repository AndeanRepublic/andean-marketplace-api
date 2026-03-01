import { CartShopDocument } from '../../persistence/cartShop.schema';
import { CartShop } from '../../../domain/entities/CartShop';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class CartShopMapper {
	static fromDocument(doc: CartShopDocument): CartShop {
		const plain = doc.toObject() as CartShopDocument;
		return plainToInstance(CartShop, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static toPersistence(cart: CartShop | Partial<CartShop>) {
		const plain = instanceToPlain(cart);
		const { id: _id1, _id: _id2, __v: _v, ...updateData } = plain;
		return {
			...updateData,
		};
	}
}
