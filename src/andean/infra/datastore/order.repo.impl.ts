import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../app/datastore/Order.repo';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../persistence/order.schema';
import { Order } from '../../domain/entities/Order';
import { Model } from 'mongoose';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { UpdateOrderDto } from '../controllers/dto/UpdateOrderDto';
import { OrderMapper } from '../services/OrderMapper';

@Injectable()
export class OrderRepositoryImpl extends OrderRepository {
	constructor(
		@InjectModel('Order')
		private readonly orderModel: Model<OrderDocument>,
	) {
		super();
	}

	async getOrderById(id: string): Promise<Order | null> {
		const doc = await this.orderModel.findOne({ id }).exec();
		return doc ? OrderMapper.fromDocument(doc) : null;
	}

	async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
		const docs = await this.orderModel.find({ customerId }).exec();
		return docs.map(doc => OrderMapper.fromDocument(doc));
	}

	async createOrder(order: Order): Promise<Order> {
		const created = new this.orderModel({
			_id: crypto.randomUUID(),
			id: order.id,
			customerId: order.userId,
			totalAmount: order.totalAmount,
			status: order.status,
			paymentMethod: order.paymentMethod,
		});
		const saved = await created.save();
		return OrderMapper.fromDocument(saved);
	}

	async updateOrder(id: string, dto: UpdateOrderDto): Promise<Order | null> {
		const updateData: any = {};

		if (dto.status !== undefined) {
			updateData.status = OrderStatus[dto.status as keyof typeof OrderStatus];
		}

		const updated = await this.orderModel
			.findOneAndUpdate({ id }, updateData, { new: true })
			.exec();

		return updated ? OrderMapper.fromDocument(updated) : null;
	}
}
