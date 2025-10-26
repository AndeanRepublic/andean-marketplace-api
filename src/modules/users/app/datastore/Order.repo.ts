import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/enums/OrderStatus';

export abstract class OrderRepository {
  abstract getOrderById(id: string): Promise<Order>;
  abstract getOrdersByCustomerId(customerId: string): Promise<Order[]>;
  abstract createOrder(order: Order): Promise<Order>;
  abstract updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
}
