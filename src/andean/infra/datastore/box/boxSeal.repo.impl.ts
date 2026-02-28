import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoxSealRepository } from '../../../app/datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { BoxSealDocument } from '../../persistence/box/boxSeal.schema';
import { BoxSealMapper } from '../../services/box/BoxSealMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class BoxSealRepoImpl extends BoxSealRepository {
	constructor(
		@InjectModel('BoxSeal')
		private readonly boxSealModel: Model<BoxSealDocument>,
	) {
		super();
	}

	async create(boxSeal: BoxSeal): Promise<BoxSeal> {
		const data = BoxSealMapper.toPersistence(boxSeal);
		const created = new this.boxSealModel(data);
		const saved = await created.save();
		return BoxSealMapper.fromDocument(saved);
	}

	async getAll(): Promise<BoxSeal[]> {
		const docs = await this.boxSealModel.find().exec();
		return docs.map((doc) => BoxSealMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<BoxSeal | null> {
		try {
			const objectId = MongoIdUtils.stringToObjectId(id);
			const doc = await this.boxSealModel.findById(objectId).exec();
			return doc ? BoxSealMapper.fromDocument(doc) : null;
		} catch {
			return null;
		}
	}

	async update(id: string, boxSeal: Partial<BoxSeal>): Promise<BoxSeal> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const data = BoxSealMapper.toPersistence(boxSeal);
		const updated = await this.boxSealModel
			.findByIdAndUpdate(objectId, { $set: data }, { new: true })
			.exec();
		return BoxSealMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.boxSealModel.findByIdAndDelete(objectId).exec();
	}

	async getByIds(ids: string[]): Promise<BoxSeal[]> {
		if (!ids.length) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.boxSealModel
			.find({ _id: { $in: objectIds } })
			.exec();
		return docs.map((doc) => BoxSealMapper.fromDocument(doc));
	}
}
