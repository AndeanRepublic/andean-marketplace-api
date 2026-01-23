import { CartShopItemRepository } from '../../app/datastore/CartShopItem.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CartShopItemDocument } from '../persistence/cartShopItem.schema';
import { CartItem } from 'src/andean/domain/entities/CartItem';
import { CartItemMapper } from '../services/CartItemMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class CartShopItemRepoImpl extends CartShopItemRepository {
	constructor(
		@InjectModel('CartShopItem')
		private readonly cartShopItemModel: Model<CartShopItemDocument>,
	) {
		super();
	}

	async getItemsByCartShopId(cartShopId: string): Promise<CartItem[]> {
		const docs = await this.cartShopItemModel.find({ cartShopId }).exec();
		return docs.map((doc: CartShopItemDocument) =>
			CartItemMapper.fromDocument(doc),
		);
	}

	async getItemsByCustomerId(customerId: string): Promise<CartItem[]> {
		const docs = await this.cartShopItemModel.find({ customerId }).exec();
		return docs.map((doc: CartShopItemDocument) =>
			CartItemMapper.fromDocument(doc),
		);
	}

	async createItem(item: CartItem): Promise<CartItem> {
		const created = new this.cartShopItemModel(
			CartItemMapper.toPersistence(item),
		);
		const savedItem = await created.save();
		return CartItemMapper.fromDocument(savedItem);
	}

	async deleteItem(itemId: string): Promise<void> {
		await this.cartShopItemModel.findByIdAndDelete(itemId).exec();
	}

	async deleteItemsByCartShopId(cartShopId: string): Promise<void> {
		await this.cartShopItemModel.deleteMany({ cartShopId }).exec();
	}

	async getById(id: string): Promise<CartItem | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.cartShopItemModel.findById(objectId).exec();
		return doc ? CartItemMapper.fromDocument(doc) : null;
	}

	async updateQuantity(id: string, quantityDelta: number): Promise<CartItem> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.cartShopItemModel
			.findByIdAndUpdate(
				objectId,
				{ $inc: { quantity: quantityDelta }, $set: { updatedAt: new Date() } },
				{ new: true },
			)
			.exec();
		if (!updated) {
			throw new Error('CartItem not found');
		}
		return CartItemMapper.fromDocument(updated);
	}
}
