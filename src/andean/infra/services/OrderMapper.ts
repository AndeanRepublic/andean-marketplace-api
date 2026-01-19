import { Order } from '../../domain/entities/Order';
import { OrderDocument } from '../persistence/order.schema';
import { CreateOrderDto } from '../controllers/dto/CreateOrderDto';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../domain/enums/PaymentMethod';
import * as crypto from 'crypto';

export class OrderMapper {
	static fromDocument(doc: OrderDocument): Order {
		return new Order(
			doc.id,
			doc.userId,
			doc.totalAmount,
			doc.status,
			doc.paymentMethod,
		);
	}

	static fromCreateDto(dto: CreateOrderDto): Order {
		return new Order(
			crypto.randomUUID(),
			dto.customerId,
			dto.totalAmount,
			OrderStatus.PAID,
			PaymentMethod[dto.paymentMethod as keyof typeof PaymentMethod],
		);
	}

	static toDocument(entity: Order): Partial<OrderDocument> {
		return {
			id: entity.id,
			userId: entity.userId,
			totalAmount: entity.totalAmount,
			status: entity.status,
			paymentMethod: entity.paymentMethod,
		};
	}
}
