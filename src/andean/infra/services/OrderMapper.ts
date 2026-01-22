import { Order } from '../../domain/entities/Order';
import { OrderDocument } from '../persistence/order.schema';
import { CreateOrderDto } from '../controllers/dto/CreateOrderDto';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../domain/enums/PaymentMethod';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';
import { Types } from 'mongoose';

export class OrderMapper {
	static fromDocument(doc: OrderDocument): Order {
		const plain = doc.toObject();
		return plainToInstance(Order, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateOrderDto): Order {
		const { ...orderData } = dto;
		const now = new Date();
		return plainToInstance(Order, {
			id: new Types.ObjectId().toString(),
			...orderData,
			createdAt: now,
			updatedAt: now,
		});
	}

	static toPersistence(order: Order | Partial<Order>) {
		const plain = instanceToPlain(order);
		const { id, _id, __v, ...updateData } = plain;
		return {
			...updateData,
		};
	}
}
