import { OrderItemDocument } from '../persistence/orderItem.schema';
import { OrderItem } from '../../domain/entities/OrderItem';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class OrderItemMapper {
  static fromDocument(doc: OrderItemDocument): OrderItem {
    const plain = doc.toObject();
    return plainToInstance(OrderItem, {
      id: plain._id.toString(),
      ...plain,
    });
  }

  static toPersistence(item: OrderItem) {
    const plain = instanceToPlain(item);
    const { id, _id, __v, ...updateData } = plain;
    return {
      ...updateData,
    };
  }
}
