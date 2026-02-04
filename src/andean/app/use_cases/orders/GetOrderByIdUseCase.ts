import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';

@Injectable()
export class GetOrderByIdUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(orderId: string): Promise<Order | null> {
		return this.orderRepository.getOrderById(orderId);
	}
}
