import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodCategoryRepository } from '../../../app/datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryDocument } from '../../persistence/superfood/superfoodCategory.schema';
import { SuperfoodCategoryMapper } from '../../services/superfood/SuperfoodCategoryMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodCategoryRepoImpl implements SuperfoodCategoryRepository {
	constructor(
		@InjectModel('SuperfoodCategory')
		private readonly model: Model<SuperfoodCategoryDocument>,
	) {}

	async getCategoryById(id: string): Promise<SuperfoodCategory | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodCategoryMapper.fromDocument(doc);
	}

	async getAllCategories(): Promise<SuperfoodCategory[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => SuperfoodCategoryMapper.fromDocument(doc));
	}

	async saveCategory(category: SuperfoodCategory): Promise<SuperfoodCategory> {
		const persistenceData = SuperfoodCategoryMapper.toPersistence(category);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodCategoryMapper.fromDocument(savedDoc);
	}

	async updateCategory(
		category: SuperfoodCategory,
	): Promise<SuperfoodCategory> {
		const persistenceData = SuperfoodCategoryMapper.toPersistence(category);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(category.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('Category not found for update');
		}

		return SuperfoodCategoryMapper.fromDocument(updatedDoc);
	}

	async deleteCategory(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
