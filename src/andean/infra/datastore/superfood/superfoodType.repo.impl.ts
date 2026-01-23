import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodTypeRepository } from '../../../app/datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeDocument } from '../../persistence/superfood/superfoodType.schema';
import { SuperfoodTypeMapper } from '../../services/superfood/SuperfoodTypeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodTypeRepoImpl implements SuperfoodTypeRepository {
	constructor(
		@InjectModel('SuperfoodType')
		private readonly model: Model<SuperfoodTypeDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodType | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodTypeMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodType[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => SuperfoodTypeMapper.fromDocument(doc));
	}

	async save(type: SuperfoodType): Promise<SuperfoodType> {
		const persistenceData = SuperfoodTypeMapper.toPersistence(type);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodTypeMapper.fromDocument(savedDoc);
	}

	async update(type: SuperfoodType): Promise<SuperfoodType> {
		const persistenceData = SuperfoodTypeMapper.toPersistence(type);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(type.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodType not found for update');
		}

		return SuperfoodTypeMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
