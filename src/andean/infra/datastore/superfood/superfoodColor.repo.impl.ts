import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SuperfoodColorRepository } from '../../../app/datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodColor } from '../../../domain/entities/superfoods/SuperfoodColor';
import { SuperfoodColorCatalogDocument } from '../../persistence/superfood/superfoodColor.schema';
import { SuperfoodColorMapper } from '../../services/superfood/SuperfoodColorMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodColorRepoImpl implements SuperfoodColorRepository {
	constructor(
		@InjectModel('SuperfoodColor')
		private readonly model: Model<SuperfoodColorCatalogDocument>,
	) {}

	async getById(id: string): Promise<SuperfoodColor | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return SuperfoodColorMapper.fromDocument(doc);
	}

	async getByIds(ids: string[]): Promise<SuperfoodColor[]> {
		if (!ids.length) return [];
		const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
		const objectIds = unique
			.filter((id) => Types.ObjectId.isValid(id))
			.map((id) => new Types.ObjectId(id));
		if (!objectIds.length) return [];
		const docs = await this.model.find({ _id: { $in: objectIds } }).exec();
		return docs.map((doc) => SuperfoodColorMapper.fromDocument(doc));
	}

	async getAll(): Promise<SuperfoodColor[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => SuperfoodColorMapper.fromDocument(doc));
	}

	async save(color: SuperfoodColor): Promise<SuperfoodColor> {
		const persistenceData = SuperfoodColorMapper.toPersistence(color);
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return SuperfoodColorMapper.fromDocument(savedDoc);
	}

	async update(color: SuperfoodColor): Promise<SuperfoodColor> {
		const persistenceData = SuperfoodColorMapper.toPersistence(color);
		persistenceData.updatedAt = new Date();

		const objectId = MongoIdUtils.stringToObjectId(color.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('SuperfoodColor not found for update');
		}

		return SuperfoodColorMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async saveMany(colors: SuperfoodColor[]): Promise<SuperfoodColor[]> {
		const persistenceData = colors.map((c) =>
			SuperfoodColorMapper.toPersistence(c),
		);
		const savedDocs = await this.model.insertMany(persistenceData);
		return savedDocs.map((doc) =>
			SuperfoodColorMapper.fromDocument(
				doc as unknown as SuperfoodColorCatalogDocument,
			),
		);
	}
}
