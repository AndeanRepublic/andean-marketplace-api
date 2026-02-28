import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DetailSourceProductRepository } from '../../app/datastore/DetailSourceProduct.repo';
import { DetailSourceProduct } from '../../domain/entities/superfoods/DetailSourceProduct';
import { DetailSourceProductDocument } from '../persistence/superfood/detailSourceProduct.schema';
import { DetailSourceProductMapper } from '../services/superfood/DetailSourceProductMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class DetailSourceProductRepoImpl implements DetailSourceProductRepository {
	constructor(
		@InjectModel('DetailSourceProduct')
		private readonly model: Model<DetailSourceProductDocument>,
	) {}

	async create(
		detailSourceProduct: DetailSourceProduct,
	): Promise<DetailSourceProduct> {
		const persistenceData =
			DetailSourceProductMapper.toPersistence(detailSourceProduct);
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return DetailSourceProductMapper.fromDocument(savedDoc);
	}

	async getById(id: string): Promise<DetailSourceProduct | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return DetailSourceProductMapper.fromDocument(doc);
	}

	async getAll(): Promise<DetailSourceProduct[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => DetailSourceProductMapper.fromDocument(doc));
	}

	async update(
		id: string,
		detailSourceProduct: Partial<DetailSourceProduct>,
	): Promise<DetailSourceProduct> {
		const persistenceData =
			DetailSourceProductMapper.toPersistence(detailSourceProduct);
		persistenceData.updatedAt = new Date();

		const objectId = MongoIdUtils.stringToObjectId(id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, persistenceData, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('DetailSourceProduct not found for update');
		}

		return DetailSourceProductMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
