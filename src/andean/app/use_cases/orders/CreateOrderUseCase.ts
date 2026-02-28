import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { CreateOrderDto } from '../../../infra/controllers/dto/order/CreateOrderDto';
import { Order } from '../../../domain/entities/order/Order';
import { OrderMapper } from '../../../infra/services/order/OrderMapper';

@Injectable()
export class CreateOrderUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(orderDto: CreateOrderDto): Promise<Order> {
		// Validar que customerId o customerEmail esté presente
		if (!orderDto.customerId && !orderDto.customerEmail) {
			throw new BadRequestException(
				'Either customerId or customerEmail must be present',
			);
		}

		// Crear Order desde DTO usando mapper
		const order = OrderMapper.fromCreateDto(orderDto);

		return this.orderRepository.createOrder(order);
	}
}
