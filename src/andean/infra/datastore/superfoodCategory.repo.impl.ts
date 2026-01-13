import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodCategoryRepository } from '../../app/datastore/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryDocument } from '../persistence/superfoodCategory.schema';
import { SuperfoodCategoryMapper } from '../services/SuperfoodCategoryMapper';

@Injectable()
export class SuperfoodCategoryRepoImpl implements SuperfoodCategoryRepository {
	constructor(
		@InjectModel('SuperfoodCategory')
		private readonly model: Model<SuperfoodCategoryDocument>,
	) { }

	async getCategoryById(id: string): Promise<SuperfoodCategory | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodCategoryMapper.fromDocument(doc);
	}

	async getAllCategories(): Promise<SuperfoodCategory[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodCategoryMapper.fromDocument(doc));
	}

	async saveCategory(category: SuperfoodCategory): Promise<SuperfoodCategory> {
		const persistenceData = SuperfoodCategoryMapper.toPersistence(category);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodCategoryMapper.fromDocument(savedDoc);
	}

	async updateCategory(category: SuperfoodCategory): Promise<SuperfoodCategory> {
		const persistenceData = SuperfoodCategoryMapper.toPersistence(category);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: category.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('Category not found for update');
		}

		return SuperfoodCategoryMapper.fromDocument(updatedDoc);
	}

	async deleteCategory(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
