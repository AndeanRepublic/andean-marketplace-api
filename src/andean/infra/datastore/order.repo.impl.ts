import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../app/datastore/Order.repo';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../persistence/order.schema';
import { Order } from '../../domain/entities/Order';
import { Model } from 'mongoose';
import { OrderMapper } from '../services/OrderMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class OrderRepositoryImpl extends OrderRepository {
	constructor(
		@InjectModel('Order')
		private readonly orderModel: Model<OrderDocument>,
	) {
		super();
	}

	async getOrderById(id: string): Promise<Order | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.orderModel.findById(objectId).exec();
		return doc ? OrderMapper.fromDocument(doc) : null;
	}

	async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
		const docs = await this.orderModel.find({ customerId }).exec();
		return docs.map(doc => OrderMapper.fromDocument(doc));
	}

	async createOrder(order: Order): Promise<Order> {
		const plain = OrderMapper.toPersistence(order);
		const created = new this.orderModel({
			...plain,
		});
		const saved = await created.save();
		return OrderMapper.fromDocument(saved);
	}

	async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
		const plain = OrderMapper.toPersistence(order);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.orderModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return OrderMapper.fromDocument(updated!);
	}
}
