import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';

@Injectable()
export class GetAllOrdersUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(): Promise<Order[]> {
		return this.orderRepository.getAllOrders();
	}
}
