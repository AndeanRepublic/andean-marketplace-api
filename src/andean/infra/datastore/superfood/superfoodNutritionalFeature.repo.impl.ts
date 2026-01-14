import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodNutritionalFeatureRepository } from '../../../app/datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureDocument } from '../../persistence/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeatureMapper } from '../../services/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class SuperfoodNutritionalFeatureRepoImpl implements SuperfoodNutritionalFeatureRepository {
	constructor(
		@InjectModel('SuperfoodNutritionalFeature')
		private readonly model: Model<SuperfoodNutritionalFeatureDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodNutritionalFeature | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodNutritionalFeatureMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodNutritionalFeature[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodNutritionalFeatureMapper.fromDocument(doc));
	}

	async save(feature: SuperfoodNutritionalFeature): Promise<SuperfoodNutritionalFeature> {
		const persistenceData = SuperfoodNutritionalFeatureMapper.toPersistence(feature);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodNutritionalFeatureMapper.fromDocument(savedDoc);
	}

	async update(feature: SuperfoodNutritionalFeature): Promise<SuperfoodNutritionalFeature> {
		const persistenceData = SuperfoodNutritionalFeatureMapper.toPersistence(feature);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: feature.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodNutritionalFeature not found for update');
		}

		return SuperfoodNutritionalFeatureMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
