import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { UpdateOrderDto } from '../../../infra/controllers/dto/order/UpdateOrderDto';
import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UpdateOrderStatusUseCase {
	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async handle(orderId: string, dto: UpdateOrderDto): Promise<Order> {
		// Validar formato de ID
		if (!isValidObjectId(orderId)) {
			throw new BadRequestException('Invalid order ID');
		}

		const orderFound = await this.orderRepository.getOrderById(orderId);
		if (!orderFound) {
			throw new NotFoundException('Order not found');
		}

		// Validar estado (el ValidationPipe ya valida el enum, pero por seguridad)
		const newStatus = OrderStatus[dto.status as keyof typeof OrderStatus];
		if (!newStatus) {
			throw new BadRequestException(`Invalid order status: ${dto.status}`);
		}

		// Usar el nuevo método changeOrderStatus
		return this.orderRepository.changeOrderStatus(orderId, newStatus);
	}
}
