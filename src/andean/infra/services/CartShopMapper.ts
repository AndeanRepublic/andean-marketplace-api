import { CartShopDocument } from '../persistence/cartShop.schema';
import { CartShop } from '../../domain/entities/CartShop';

export class CartShopMapper {
  static toDomain(doc: CartShopDocument): CartShop {
    return new CartShop(doc.id, doc.customerId, [], doc.totalAmount);
  }
}
