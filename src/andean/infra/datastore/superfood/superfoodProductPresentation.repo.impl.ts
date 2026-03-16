import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodProductPresentationRepository } from '../../../app/datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { SuperfoodProductPresentationDocument } from '../../persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodProductPresentationMapper } from '../../services/superfood/SuperfoodProductPresentationMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodProductPresentationRepoImpl implements SuperfoodProductPresentationRepository {
	constructor(
		@InjectModel('SuperfoodProductPresentation')
		private readonly model: Model<SuperfoodProductPresentationDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodProductPresentation | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodProductPresentationMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodProductPresentation[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) =>
			SuperfoodProductPresentationMapper.fromDocument(doc),
		);
	}

	async save(
		presentation: SuperfoodProductPresentation,
	): Promise<SuperfoodProductPresentation> {
		const persistenceData =
			SuperfoodProductPresentationMapper.toPersistence(presentation);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodProductPresentationMapper.fromDocument(savedDoc);
	}

	async update(
		presentation: SuperfoodProductPresentation,
	): Promise<SuperfoodProductPresentation> {
		const persistenceData =
			SuperfoodProductPresentationMapper.toPersistence(presentation);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(presentation.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodProductPresentation not found for update');
		}

		return SuperfoodProductPresentationMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async saveMany(
		presentations: SuperfoodProductPresentation[],
	): Promise<SuperfoodProductPresentation[]> {
		const persistenceData = presentations.map((presentation) =>
			SuperfoodProductPresentationMapper.toPersistence(presentation),
		);
		const savedDocs = await this.model.insertMany(persistenceData);
		return savedDocs.map((doc) =>
			SuperfoodProductPresentationMapper.fromDocument(
				doc as SuperfoodProductPresentationDocument,
			),
		);
	}
}
