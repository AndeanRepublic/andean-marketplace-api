import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductDocument } from '../../persistence/superfood/superfood.schema';
import { SuperfoodProductMapper } from '../../services/superfood/SuperfoodProductMapper';

@Injectable()
export class SuperfoodProductRepoImpl implements SuperfoodProductRepository {
	constructor(
		@InjectModel('SuperfoodProduct')
		private readonly model: Model<SuperfoodProductDocument>,
	) { }

	async getSuperfoodProductById(id: string): Promise<SuperfoodProduct | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodProductMapper.fromDocument(doc);
	}

	async getAllByOwnerId(ownerId: string): Promise<SuperfoodProduct[]> {
		const docs = await this.model.find({ 'baseInfo.ownerId': ownerId }).exec();
		return docs.map((doc) => SuperfoodProductMapper.fromDocument(doc));
	}

	async getAllByCategoryId(categoryId: string): Promise<SuperfoodProduct[]> {
		const docs = await this.model.find({ categoryId }).exec();
		return docs.map((doc) => SuperfoodProductMapper.fromDocument(doc));
	}

	async getAllByStatus(status: string): Promise<SuperfoodProduct[]> {
		const docs = await this.model.find({ status }).exec();
		return docs.map((doc) => SuperfoodProductMapper.fromDocument(doc));
	}

	async saveSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct> {
		const persistenceData = SuperfoodProductMapper.toPersistence(product);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodProductMapper.fromDocument(savedDoc);
	}

	async updateSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct> {
		const persistenceData = SuperfoodProductMapper.toPersistence(product);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: product.id },
				{ $set: persistenceData },
				{ new: true },
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('Product not found for update');
		}

		return SuperfoodProductMapper.fromDocument(updatedDoc);
	}

	async deleteSuperfoodProduct(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}

	async getByIds(ids: string[]): Promise<SuperfoodProduct[]> {
		if (!ids.length) return [];
		const docs = await this.model.find({ id: { $in: ids } }).exec();
		return docs.map((doc) => SuperfoodProductMapper.fromDocument(doc));
	}
}
