import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodCertificationRepository } from '../../../app/datastore/superfoods/SuperfoodCertification.repo';
import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';
import { SuperfoodCertificationDocument } from '../../persistence/superfood/superfoodCertification.schema';
import { SuperfoodCertificationMapper } from '../../services/superfood/SuperfoodCertificationMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodCertificationRepoImpl implements SuperfoodCertificationRepository {
	constructor(
		@InjectModel('SuperfoodCertification')
		private readonly model: Model<SuperfoodCertificationDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodCertification | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodCertificationMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodCertification[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => SuperfoodCertificationMapper.fromDocument(doc));
	}

	async save(
		certification: SuperfoodCertification,
	): Promise<SuperfoodCertification> {
		const persistenceData =
			SuperfoodCertificationMapper.toPersistence(certification);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodCertificationMapper.fromDocument(savedDoc);
	}

	async update(
		certification: SuperfoodCertification,
	): Promise<SuperfoodCertification> {
		const persistenceData =
			SuperfoodCertificationMapper.toPersistence(certification);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(certification.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodCertification not found for update');
		}

		return SuperfoodCertificationMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async saveMany(
		certifications: SuperfoodCertification[],
	): Promise<SuperfoodCertification[]> {
		const persistenceData = certifications.map((certification) =>
			SuperfoodCertificationMapper.toPersistence(certification),
		);
		const savedDocs = await this.model.insertMany(persistenceData);
		return savedDocs.map((doc) =>
			SuperfoodCertificationMapper.fromDocument(
				doc as SuperfoodCertificationDocument,
			),
		);
	}
}
