import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';
import { BoxDocument } from '../../persistence/box/box.schema';
import { BoxMapper } from '../../services/box/BoxMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class BoxRepoImpl extends BoxRepository {
	constructor(
		@InjectModel('Box') private readonly boxModel: Model<BoxDocument>,
	) {
		super();
	}

	async create(box: Box): Promise<Box> {
		const data = BoxMapper.toPersistence(box);
		const created = new this.boxModel(data);
		const saved = await created.save();
		return BoxMapper.fromDocument(saved);
	}

	async getById(id: string): Promise<Box | null> {
		try {
			const objectId = MongoIdUtils.stringToObjectId(id);
			const doc = await this.boxModel.findById(objectId).exec();
			return doc ? BoxMapper.fromDocument(doc) : null;
		} catch {
			return null;
		}
	}

	async getAll(page: number, perPage: number): Promise<{ data: Box[]; total: number }> {
		const skip = (page - 1) * perPage;
		const [docs, total] = await Promise.all([
			this.boxModel.find().skip(skip).limit(perPage).exec(),
			this.boxModel.countDocuments().exec(),
		]);
		const data = docs.map((doc) => BoxMapper.fromDocument(doc));
		return { data, total };
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.boxModel.findByIdAndDelete(objectId).exec();
	}
}
