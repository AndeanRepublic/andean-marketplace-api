import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodBenefitRepository } from '../../../app/datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitDocument } from '../../persistence/superfood/superfoodBenefit.schema';
import { SuperfoodBenefitMapper } from '../../services/superfood/SuperfoodBenefitMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodBenefitRepoImpl implements SuperfoodBenefitRepository {
	constructor(
		@InjectModel('SuperfoodBenefit')
		private readonly model: Model<SuperfoodBenefitDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodBenefit | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodBenefitMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodBenefit[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodBenefitMapper.fromDocument(doc));
	}

	async save(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit> {
		const persistenceData = SuperfoodBenefitMapper.toPersistence(benefit);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodBenefitMapper.fromDocument(savedDoc);
	}

	async update(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit> {
		const persistenceData = SuperfoodBenefitMapper.toPersistence(benefit);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(benefit.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(
				objectId,
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodBenefit not found for update');
		}

		return SuperfoodBenefitMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
