import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { OrderRepository } from '../../datastore/Order.repo';
import { CreateOrderDto } from '../../../infra/controllers/dto/CreateOrderDto';
import { Order } from '../../../domain/entities/Order';
import { OrderMapper } from '../../../infra/services/OrderMapper';

@Injectable()
export class CreateOrderUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) { }

	async handle(orderDto: CreateOrderDto): Promise<Order> {
		const customerFound = await this.customerRepository.getCustomerById(
			orderDto.customerId,
		);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}

		const orderToSave = OrderMapper.fromCreateDto(orderDto);
		return this.orderRepository.createOrder(orderToSave);
	}
}
