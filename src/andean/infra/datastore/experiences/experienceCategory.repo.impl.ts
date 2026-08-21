import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceCategoryRepository } from '../../../app/datastore/experiences/ExperienceCategory.repo';
import { ExperienceCategory } from '../../../domain/entities/experiences/ExperienceCategory';
import { ExperienceCategoryDocument } from '../../persistence/experiences/experienceCategory.schema';
import { ExperienceCategoryMapper } from '../../services/experiences/ExperienceCategoryMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceCategoryRepositoryImpl extends ExperienceCategoryRepository {
	constructor(
		@InjectModel('ExperienceCategory')
		private readonly model: Model<ExperienceCategoryDocument>,
	) {
		super();
	}

	async getCategoryById(id: string): Promise<ExperienceCategory | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return ExperienceCategoryMapper.fromDocument(doc);
	}

	async getAllCategories(): Promise<ExperienceCategory[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceCategoryMapper.fromDocument(doc));
	}

	async saveCategory(category: ExperienceCategory): Promise<ExperienceCategory> {
		const persistenceData = ExperienceCategoryMapper.toPersistence(category);
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return ExperienceCategoryMapper.fromDocument(savedDoc);
	}

	async updateCategory(
		category: ExperienceCategory,
	): Promise<ExperienceCategory> {
		const persistenceData = ExperienceCategoryMapper.toPersistence(category);
		persistenceData.updatedAt = new Date();
		const objectId = MongoIdUtils.stringToObjectId(category.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();
		if (!updatedDoc) {
			throw new Error('Category not found for update');
		}
		return ExperienceCategoryMapper.fromDocument(updatedDoc);
	}

	async deleteCategory(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async saveManyCategories(
		categories: ExperienceCategory[],
	): Promise<ExperienceCategory[]> {
		const persistenceData = categories.map((category) =>
			ExperienceCategoryMapper.toPersistence(category),
		);
		const savedDocs = await this.model.insertMany(persistenceData);
		return savedDocs.map((doc) =>
			ExperienceCategoryMapper.fromDocument(doc as ExperienceCategoryDocument),
		);
	}
}
