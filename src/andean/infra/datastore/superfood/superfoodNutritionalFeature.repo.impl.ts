import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodNutritionalFeatureRepository } from '../../../app/datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureDocument } from '../../persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeatureMapper } from '../../services/superfood/SuperfoodNutritionalFeatureMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodNutritionalFeatureRepoImpl implements SuperfoodNutritionalFeatureRepository {
	constructor(
		@InjectModel('SuperfoodNutritionalFeature')
		private readonly model: Model<SuperfoodNutritionalFeatureDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodNutritionalFeature | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodNutritionalFeatureMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodNutritionalFeature[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) =>
			SuperfoodNutritionalFeatureMapper.fromDocument(doc),
		);
	}

	async save(
		feature: SuperfoodNutritionalFeature,
	): Promise<SuperfoodNutritionalFeature> {
		const persistenceData =
			SuperfoodNutritionalFeatureMapper.toPersistence(feature);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodNutritionalFeatureMapper.fromDocument(savedDoc);
	}

	async update(
		feature: SuperfoodNutritionalFeature,
	): Promise<SuperfoodNutritionalFeature> {
		const persistenceData =
			SuperfoodNutritionalFeatureMapper.toPersistence(feature);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(feature.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodNutritionalFeature not found for update');
		}

		return SuperfoodNutritionalFeatureMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async getByIds(ids: string[]): Promise<SuperfoodNutritionalFeature[]> {
		if (!ids.length) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.model.find({ _id: { $in: objectIds } }).exec();
		return docs.map((doc) => SuperfoodNutritionalFeatureMapper.fromDocument(doc));
	}
}
