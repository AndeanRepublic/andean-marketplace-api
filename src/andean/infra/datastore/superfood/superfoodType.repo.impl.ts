import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodTypeRepository } from '../../../app/datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeDocument } from '../../persistence/superfoodType.schema';
import { SuperfoodTypeMapper } from '../../services/SuperfoodTypeMapper';

@Injectable()
export class SuperfoodTypeRepoImpl implements SuperfoodTypeRepository {
	constructor(
		@InjectModel('SuperfoodType')
		private readonly model: Model<SuperfoodTypeDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodType | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodTypeMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodType[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodTypeMapper.fromDocument(doc));
	}

	async save(type: SuperfoodType): Promise<SuperfoodType> {
		const persistenceData = SuperfoodTypeMapper.toPersistence(type);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodTypeMapper.fromDocument(savedDoc);
	}

	async update(type: SuperfoodType): Promise<SuperfoodType> {
		const persistenceData = SuperfoodTypeMapper.toPersistence(type);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: type.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodType not found for update');
		}

		return SuperfoodTypeMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
