import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { Order } from '../../../domain/entities/order/Order';
import { isValidObjectId } from 'mongoose';
import { OrderItemEnricher } from '../../../infra/services/order/OrderItemEnricher';

@Injectable()
export class GetOrderByIdUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly orderItemEnricher: OrderItemEnricher,
	) { }

	async handle(orderId: string): Promise<Order> {
		// Validar formato de ID
		if (!isValidObjectId(orderId)) {
			throw new BadRequestException('Invalid order ID');
		}

		const order = await this.orderRepository.getOrderById(orderId);
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		const enrichedOrders = await this.orderItemEnricher.enrichOrders([order]);
		return enrichedOrders[0];
	}
}
