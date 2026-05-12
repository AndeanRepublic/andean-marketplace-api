import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';

@Injectable()
export class GetAllOrdersUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly orderItemEnricher: OrderItemEnricher,
	) {}

	async handle(): Promise<Order[]> {
		const orders = await this.orderRepository.getAllOrders();
		return this.orderItemEnricher.enrichOrders(orders);
	}
}
