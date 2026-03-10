import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodPreservationMethodRepository } from '../../../app/datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { SuperfoodPreservationMethodDocument } from '../../persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodPreservationMethodMapper } from '../../services/superfood/SuperfoodPreservationMethodMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodPreservationMethodRepoImpl implements SuperfoodPreservationMethodRepository {
	constructor(
		@InjectModel('SuperfoodPreservationMethod')
		private readonly model: Model<SuperfoodPreservationMethodDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodPreservationMethod | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodPreservationMethodMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodPreservationMethod[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) =>
			SuperfoodPreservationMethodMapper.fromDocument(doc),
		);
	}

	async save(
		method: SuperfoodPreservationMethod,
	): Promise<SuperfoodPreservationMethod> {
		const persistenceData =
			SuperfoodPreservationMethodMapper.toPersistence(method);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodPreservationMethodMapper.fromDocument(savedDoc);
	}

	async update(
		method: SuperfoodPreservationMethod,
	): Promise<SuperfoodPreservationMethod> {
		const persistenceData =
			SuperfoodPreservationMethodMapper.toPersistence(method);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(method.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodPreservationMethod not found for update');
		}

		return SuperfoodPreservationMethodMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async saveMany(
		methods: SuperfoodPreservationMethod[],
	): Promise<SuperfoodPreservationMethod[]> {
		const persistenceData = methods.map((method) =>
			SuperfoodPreservationMethodMapper.toPersistence(method),
		);
		const savedDocs = await this.model.insertMany(persistenceData);
		return savedDocs.map((doc) =>
			SuperfoodPreservationMethodMapper.fromDocument(
				doc as SuperfoodPreservationMethodDocument,
			),
		);
	}
}
