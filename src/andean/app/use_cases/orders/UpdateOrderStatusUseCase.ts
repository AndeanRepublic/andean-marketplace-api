import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/Order.repo';
import { UpdateOrderDto } from '../../../infra/controllers/dto/UpdateOrderDto';
import { Order } from '../../../domain/entities/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

@Injectable()
export class UpdateOrderStatusUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async handle(orderId: string, dto: UpdateOrderDto): Promise<Order> {
		const orderFound = await this.orderRepository.getOrderById(orderId);
		if (!orderFound) {
			throw new NotFoundException('Order not found');
		}

		const partialOrder: Partial<Order> = {
			...orderFound,
			status: OrderStatus[dto.status as keyof typeof OrderStatus],
			updatedAt: new Date(),
		};

		const updated = await this.orderRepository.updateOrder(
			orderId,
			partialOrder,
		);

		if (!updated) {
			throw new NotFoundException('Failed to update Order');
		}

		return updated;
	}
}
