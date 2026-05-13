import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';
import { isValidObjectId } from 'mongoose';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';

@Injectable()
export class GetOrdersByCustomerUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly orderItemEnricher: OrderItemEnricher,
	) { }

	async handle(customerId: string): Promise<Order[]> {
		// Validar formato de ID
		if (!isValidObjectId(customerId)) {
			throw new BadRequestException('Invalid customer ID');
		}

		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('Customer not found');
		}
		const orders = await this.orderRepository.getOrdersByCustomerId(customerId);
		return this.orderItemEnricher.enrichOrders(orders);
	}
}
