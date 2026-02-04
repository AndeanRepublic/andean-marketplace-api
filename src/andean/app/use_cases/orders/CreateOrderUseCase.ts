import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { CreateOrderDto } from '../../../infra/controllers/dto/order/CreateOrderDto';
import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { Types } from 'mongoose';

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

		// Crear Order desde DTO
		const now = new Date();
		const order = new Order(
			new Types.ObjectId().toString(),
			orderDto.customerId,
			orderDto.customerEmail,
			orderDto.status || OrderStatus.PROCESSING,
			orderDto.items,
			orderDto.pricing,
			orderDto.shippingInfo,
			orderDto.payment,
			now,
			now,
		);

		return this.orderRepository.createOrder(order);
	}
}
