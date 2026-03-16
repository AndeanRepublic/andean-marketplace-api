import { ShopDocument } from '../persistence/shop.schema';
import { Shop } from '../../domain/entities/Shop';

export class ShopMapper {
	static fromDocument(doc: ShopDocument): Shop {
		return new Shop(
			doc.id,
			doc.sellerId,
			doc.name,
			doc.categories,
			doc.description,
			doc.policies,
			doc.shippingOrigin,
			doc.shippingArea,
			doc.providerInfoId,
		);
	}
}
