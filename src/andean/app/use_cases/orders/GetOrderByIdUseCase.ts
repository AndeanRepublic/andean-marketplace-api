import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../datastore/Order.repo';
import { Order } from '../../../domain/entities/Order';

@Injectable()
export class GetOrderByIdUseCase {
	constructor(private readonly orderRepository: OrderRepository) {}

	async handle(orderId: string): Promise<Order | null> {
		return this.orderRepository.getOrderById(orderId);
	}
}
