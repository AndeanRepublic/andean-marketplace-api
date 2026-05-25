import {
	Inject,
	Injectable,
	NotFoundException,
	BadRequestException,
	Logger,
} from '@nestjs/common';
import { OrderRepository } from '../../datastore/order/Order.repo';
import { UpdateOrderDto } from '../../../infra/controllers/dto/order/UpdateOrderDto';
import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { isValidObjectId } from 'mongoose';
import { SendOrderDeliveredUseCase } from '../email/SendOrderDeliveredUseCase';

const ADMIN_MUTABLE_ORDER_STATUSES = new Set<OrderStatus>([
	OrderStatus.PROCESSING,
	OrderStatus.DELIVERED,
	OrderStatus.CANCELLED,
]);

@Injectable()
export class UpdateOrderStatusUseCase {
	private readonly logger = new Logger(UpdateOrderStatusUseCase.name);

	constructor(
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
		private readonly sendOrderDeliveredUseCase: SendOrderDeliveredUseCase,
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

		if (!ADMIN_MUTABLE_ORDER_STATUSES.has(newStatus)) {
			throw new BadRequestException(
				`Order status ${newStatus} cannot be set from the admin panel`,
			);
		}

		const updated = await this.orderRepository.changeOrderStatus(
			orderId,
			newStatus,
		);

		if (
			orderFound.status !== OrderStatus.DELIVERED &&
			newStatus === OrderStatus.DELIVERED
		) {
			this.sendOrderDeliveredUseCase.send(updated).catch((err) =>
				this.logger.error(
					`Failed to send delivered email for order ${updated.id}`,
					err instanceof Error ? err.stack : String(err),
				),
			);
		}

		return updated;
	}
}
