import { ShopDocument } from '../persistence/shop.schema';
import { Shop } from '../../domain/entities/Shop';

export class ShopMapper {
	static fromDocument(doc: ShopDocument): Shop {
		return new Shop(
			doc.id,
			doc.sellerId,
			doc.name,
			doc.description,
			doc.categories,
			doc.policies,
			doc.shippingOrigin,
			doc.shippingArea,
		);
	}
}
