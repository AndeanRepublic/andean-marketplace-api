import { OrderItemDocument } from '../persistence/orderItem.schema';
import { OrderItem } from '../../domain/entities/OrderItem';

export class OrderItemMapper {
  static fromDocument(doc: OrderItemDocument): OrderItem {
    return new OrderItem(
      doc.id,
      doc.userId,
      doc.orderId,
      doc.productId,
      doc.variantProductId,
      doc.quantity,
      doc.price,
    );
  }

  static toPersistence(item: OrderItem) {
    return {
      _id: crypto.randomUUID(),
      id: item.id,
      userId: item.userId,
      orderId: item.orderId,
      productId: item.productId,
      variantProductId: item.variantProductId,
      quantity: item.quantity,
      price: item.price,
    };
  }
}
