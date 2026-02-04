import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { UpdateOrderDto } from '../../../infra/controllers/dto/order/UpdateOrderDto';
import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

@Injectable()
export class UpdateOrderStatusUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(orderId: string, dto: UpdateOrderDto): Promise<Order> {
		const orderFound = await this.orderRepository.getOrderById(orderId);
		if (!orderFound) {
			throw new NotFoundException('Order not found');
		}

		// Validar transiciones de estado (opcional - puede expandirse según reglas de negocio)
		const newStatus = OrderStatus[dto.status as keyof typeof OrderStatus];
		if (!newStatus) {
			throw new NotFoundException(`Invalid order status: ${dto.status}`);
		}

		// Usar el nuevo método changeOrderStatus
		return this.orderRepository.changeOrderStatus(orderId, newStatus);
	}
}
