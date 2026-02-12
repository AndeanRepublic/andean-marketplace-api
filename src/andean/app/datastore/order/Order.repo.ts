import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { CartShop } from '../../../domain/entities/CartShop';
import { CartItem } from '../../../domain/entities/CartItem';
import { ShippingInfo, PaymentInfo } from '../../../domain/entities/order/Order';

export abstract class OrderRepository {
	abstract getOrderById(id: string): Promise<Order | null>;
	abstract getOrdersByCustomerId(customerId: string): Promise<Order[]>;
	abstract createOrder(order: Order): Promise<Order>;
	abstract updateOrder(id: string, order: Partial<Order>): Promise<Order>;
	abstract changeOrderStatus(id: string, status: OrderStatus): Promise<Order>;
	abstract createOrderFromCart(
		cart: CartShop,
		cartItems: CartItem[],
		shippingInfo: ShippingInfo,
		payment: PaymentInfo,
		currency: string,
	): Promise<Order>;
}

