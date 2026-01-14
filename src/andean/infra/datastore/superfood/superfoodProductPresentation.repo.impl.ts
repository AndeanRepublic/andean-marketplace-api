import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodProductPresentationRepository } from '../../../app/datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { SuperfoodProductPresentationDocument } from '../../persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodProductPresentationMapper } from '../../services/superfood/SuperfoodProductPresentationMapper';

@Injectable()
export class SuperfoodProductPresentationRepoImpl implements SuperfoodProductPresentationRepository {
	constructor(
		@InjectModel('SuperfoodProductPresentation')
		private readonly model: Model<SuperfoodProductPresentationDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodProductPresentation | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodProductPresentationMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodProductPresentation[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodProductPresentationMapper.fromDocument(doc));
	}

	async save(presentation: SuperfoodProductPresentation): Promise<SuperfoodProductPresentation> {
		const persistenceData = SuperfoodProductPresentationMapper.toPersistence(presentation);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodProductPresentationMapper.fromDocument(savedDoc);
	}

	async update(presentation: SuperfoodProductPresentation): Promise<SuperfoodProductPresentation> {
		const persistenceData = SuperfoodProductPresentationMapper.toPersistence(presentation);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: presentation.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodProductPresentation not found for update');
		}

		return SuperfoodProductPresentationMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
