import { Order } from '../../domain/entities/Order';
import { UpdateOrderDto } from '../../infra/controllers/dto/UpdateOrderDto';

export abstract class OrderRepository {
	abstract getOrderById(id: string): Promise<Order | null>;
	abstract getOrdersByCustomerId(customerId: string): Promise<Order[]>;
	abstract createOrder(order: Order): Promise<Order>;
	abstract updateOrder(id: string, dto: UpdateOrderDto): Promise<Order | null>;
}
