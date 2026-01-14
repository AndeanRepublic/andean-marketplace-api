import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodSalesUnitSizeRepository } from '../../app/datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { SuperfoodSalesUnitSizeDocument } from '../persistence/superfoodSalesUnitSize.schema';
import { SuperfoodSalesUnitSizeMapper } from '../services/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class SuperfoodSalesUnitSizeRepoImpl implements SuperfoodSalesUnitSizeRepository {
	constructor(
		@InjectModel('SuperfoodSalesUnitSize')
		private readonly model: Model<SuperfoodSalesUnitSizeDocument>,
	) { }

	async getById(id: string): Promise<SuperfoodSalesUnitSize | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return SuperfoodSalesUnitSizeMapper.fromDocument(doc);
	}

	async getAll(): Promise<SuperfoodSalesUnitSize[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => SuperfoodSalesUnitSizeMapper.fromDocument(doc));
	}

	async save(unitSize: SuperfoodSalesUnitSize): Promise<SuperfoodSalesUnitSize> {
		const persistenceData = SuperfoodSalesUnitSizeMapper.toPersistence(unitSize);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return SuperfoodSalesUnitSizeMapper.fromDocument(savedDoc);
	}

	async update(unitSize: SuperfoodSalesUnitSize): Promise<SuperfoodSalesUnitSize> {
		const persistenceData = SuperfoodSalesUnitSizeMapper.toPersistence(unitSize);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: unitSize.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodSalesUnitSize not found for update');
		}

		return SuperfoodSalesUnitSizeMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
