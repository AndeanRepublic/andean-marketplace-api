import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../app/datastore/Shop.repo';
import { InjectModel } from '@nestjs/mongoose';
import { ShopDocument } from '../persistence/shop.schema';
import { Shop } from '../../domain/entities/Shop';
import { ShopMapper } from '../services/ShopMapper';
import { ShopCategory } from '../../domain/enums/ShopCategory';

@Injectable()
export class ShopRepoImpl extends ShopRepository {
	constructor(
		@InjectModel('Shop') private readonly shopModel: Model<ShopDocument>,
	) {
		super();
	}

	async getAllBySellerId(sellerId: string): Promise<Shop[]> {
		const docs = await this.shopModel.find({ sellerId }).exec();
		return docs.map((doc: ShopDocument) => ShopMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Shop | null> {
		const doc = await this.shopModel.findOne({ id }).exec();
		return doc ? ShopMapper.fromDocument(doc) : null;
	}

	async saveShop(shop: Shop): Promise<Shop> {
		const created = new this.shopModel({
			_id: crypto.randomUUID(),
			id: shop.id,
			name: shop.name,
			description: shop.description,
			categories: shop.categories,
			policies: shop.policies,
			shippingOrigin: shop.shippingOrigin,
			shippingArea: shop.shippingArea,
		});
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
}
