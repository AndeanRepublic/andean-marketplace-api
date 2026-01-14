import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodCertificationRepository } from '../../../app/datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';
import { SuperfoodCertificationDocument } from '../../persistence/superfood/superfoodCertification.schema';
import { SuperfoodCertificationMapper } from '../../services/superfood/SuperfoodCertificationMapper';

@Injectable()
export class SuperfoodCertificationRepoImpl implements SuperfoodCertificationRepository {
	constructor(
		@InjectModel('SuperfoodCertification')
		private readonly model: Model<SuperfoodCertificationDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodCertification | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodCertificationMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodCertification[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodCertificationMapper.fromDocument(doc));
	}

	async save(certification: SuperfoodCertification): Promise<SuperfoodCertification> {
		const persistenceData = SuperfoodCertificationMapper.toPersistence(certification);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodCertificationMapper.fromDocument(savedDoc);
	}

	async update(certification: SuperfoodCertification): Promise<SuperfoodCertification> {
		const persistenceData = SuperfoodCertificationMapper.toPersistence(certification);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: certification.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodCertification not found for update');
		}

		return SuperfoodCertificationMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
