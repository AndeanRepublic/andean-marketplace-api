import { Injectable } from '@nestjs/common';
import { OrderItemRepo } from '../../app/datastore/OrderItem.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItemDocument } from '../persistence/orderItem.schema';
import { OrderItem } from 'src/andean/domain/entities/OrderItem';
import { OrderItemMapper } from '../services/OrderItemMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class OrderItemRepoImpl extends OrderItemRepo {
	constructor(
		@InjectModel('OrderItem')
		private readonly orderItemModel: Model<OrderItemDocument>,
	) {
		super();
	}

	async createItem(item: OrderItem): Promise<OrderItem> {
		const created = new this.orderItemModel(
			OrderItemMapper.toPersistence(item),
		);
		const savedItem = await created.save();
		return OrderItemMapper.fromDocument(savedItem);
	}

	async deleteItem(itemId: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(itemId);
		await this.orderItemModel.findByIdAndDelete(objectId).exec();
	}
}
