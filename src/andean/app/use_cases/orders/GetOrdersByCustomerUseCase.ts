import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';

@Injectable()
export class GetOrdersByCustomerUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(customerId: string): Promise<Order[]> {
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}
		return this.orderRepository.getOrdersByCustomerId(customerId);
	}
}
