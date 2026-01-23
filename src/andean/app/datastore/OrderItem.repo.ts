import { OrderItem } from '../../domain/entities/OrderItem';

export abstract class OrderItemRepo {
	abstract createItem(item: OrderItem): Promise<OrderItem>;
	abstract deleteItem(itemId: string): Promise<void>;
}
