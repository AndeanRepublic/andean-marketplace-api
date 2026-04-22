import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../app/datastore/Shop.repo';
import { InjectModel } from '@nestjs/mongoose';
import { ShopDocument } from '../persistence/shop.schema';
import { Shop } from '../../domain/entities/Shop';
import { ShopMapper } from '../services/ShopMapper';
import { ShopCategory } from '../../domain/enums/ShopCategory';
import { AdminEntityStatus } from '../../domain/enums/AdminEntityStatus';

@Injectable()
export class ShopRepoImpl extends ShopRepository {
	constructor(
		@InjectModel('Shop') private readonly shopModel: Model<ShopDocument>,
	) {
		super();
	}

	async getAll(): Promise<Shop[]> {
		const docs = await this.shopModel.find({}).exec();
		return docs.map((doc: ShopDocument) => ShopMapper.fromDocument(doc));
	}

	async getAllBySellerId(sellerId: string): Promise<Shop[]> {
		const docs = await this.shopModel.find({ sellerId }).exec();
		return docs.map((doc: ShopDocument) => ShopMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Shop | null> {
		// Legacy-safe lookup: most records use Mongo _id, but some flows
		// historically queried an "id" field.
		const doc = await this.shopModel
			.findOne({
				$or: [{ _id: id }, { id }],
			})
			.exec();
		return doc ? ShopMapper.fromDocument(doc) : null;
	}

	async saveShop(shop: Shop): Promise<Shop> {
		const plain = ShopMapper.toPersistence(shop);
		const created = new this.shopModel(plain);
		const savedShop = await created.save();
		return ShopMapper.fromDocument(savedShop);
	}

	async deleteShop(id: string): Promise<void> {
		await this.shopModel.findByIdAndDelete(id).exec();
	}

	async getAllByCategory(category: ShopCategory): Promise<Shop[]> {
		const docs = await this.shopModel.find({ categories: category }).exec();
		return docs.map((doc: ShopDocument) => ShopMapper.fromDocument(doc));
	}

	async updateShop(id: string, data: Partial<Shop>): Promise<Shop> {
		const doc = await this.shopModel
			.findOneAndUpdate(
				{
					$or: [{ _id: id }, { id }],
				},
				{ $set: ShopMapper.toPersistence(data) },
				{ new: true },
			)
			.exec();
		if (!doc) {
			throw new NotFoundException('Shop not found');
		}
		return ShopMapper.fromDocument(doc);
	}

	async updateStatus(id: string, status: AdminEntityStatus): Promise<Shop> {
		const doc = await this.shopModel
			.findOneAndUpdate(
				{ $or: [{ _id: id }, { id }] },
				{ $set: { status } },
				{ new: true },
			)
			.exec();
		if (!doc) {
			throw new NotFoundException('Shop not found');
		}
		return ShopMapper.fromDocument(doc);
	}
}
