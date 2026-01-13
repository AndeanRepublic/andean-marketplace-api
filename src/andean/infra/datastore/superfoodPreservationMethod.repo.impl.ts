import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodPreservationMethodRepository } from '../../app/datastore/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { SuperfoodPreservationMethodDocument } from '../persistence/superfoodPreservationMethod.schema';
import { SuperfoodPreservationMethodMapper } from '../services/SuperfoodPreservationMethodMapper';

@Injectable()
export class SuperfoodPreservationMethodRepoImpl implements SuperfoodPreservationMethodRepository {
	constructor(
		@InjectModel('SuperfoodPreservationMethod')
		private readonly model: Model<SuperfoodPreservationMethodDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodPreservationMethod | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodPreservationMethodMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodPreservationMethod[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodPreservationMethodMapper.fromDocument(doc));
	}

	async save(method: SuperfoodPreservationMethod): Promise<SuperfoodPreservationMethod> {
		const persistenceData = SuperfoodPreservationMethodMapper.toPersistence(method);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodPreservationMethodMapper.fromDocument(savedDoc);
	}

	async update(method: SuperfoodPreservationMethod): Promise<SuperfoodPreservationMethod> {
		const persistenceData = SuperfoodPreservationMethodMapper.toPersistence(method);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: method.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodPreservationMethod not found for update');
		}

		return SuperfoodPreservationMethodMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
