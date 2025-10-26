import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/enums/OrderStatus';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract getById(id: string): Promise<Order>;
  abstract getByUser(customerId: string): Promise<Order[]>;
  abstract updateStatus(id: string, status: OrderStatus): Promise<void>;
}
