import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodSalesUnitSizeRepository } from '../../../app/datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { SuperfoodSalesUnitSizeDocument } from '../../persistence/superfood/superfoodSalesUnitSize.schema';
import { SuperfoodSalesUnitSizeMapper } from '../../services/superfood/SuperfoodSalesUnitSizeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodSalesUnitSizeRepoImpl implements SuperfoodSalesUnitSizeRepository {
	constructor(
		@InjectModel('SuperfoodSalesUnitSize')
		private readonly model: Model<SuperfoodSalesUnitSizeDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodSalesUnitSize | null> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodSalesUnitSizeMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodSalesUnitSize[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => SuperfoodSalesUnitSizeMapper.fromDocument(doc));
	}

	async save(
		unitSize: SuperfoodSalesUnitSize,
	): Promise<SuperfoodSalesUnitSize> {
		const persistenceData =
			SuperfoodSalesUnitSizeMapper.toPersistence(unitSize);
		// MongoDB genera automáticamente _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodSalesUnitSizeMapper.fromDocument(savedDoc);
	}

	async update(
		unitSize: SuperfoodSalesUnitSize,
	): Promise<SuperfoodSalesUnitSize> {
		const persistenceData =
			SuperfoodSalesUnitSizeMapper.toPersistence(unitSize);
		persistenceData.updatedAt = new Date();

		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(unitSize.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodSalesUnitSize not found for update');
		}

		return SuperfoodSalesUnitSizeMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		// Convertir string a ObjectId
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
