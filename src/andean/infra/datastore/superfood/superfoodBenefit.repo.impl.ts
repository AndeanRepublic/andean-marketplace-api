import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodBenefitRepository } from '../../../app/datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitDocument } from '../../persistence/superfood/superfoodBenefit.schema';
import { SuperfoodBenefitMapper } from '../../services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class SuperfoodBenefitRepoImpl implements SuperfoodBenefitRepository {
	constructor(
		@InjectModel('SuperfoodBenefit')
		private readonly model: Model<SuperfoodBenefitDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodBenefit | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodBenefitMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodBenefit[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodBenefitMapper.fromDocument(doc));
	}

	async save(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit> {
		const persistenceData = SuperfoodBenefitMapper.toPersistence(benefit);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodBenefitMapper.fromDocument(savedDoc);
	}

	async update(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit> {
		const persistenceData = SuperfoodBenefitMapper.toPersistence(benefit);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: benefit.id },
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
		await this.model.deleteOne({ id }).exec();
	}
}
