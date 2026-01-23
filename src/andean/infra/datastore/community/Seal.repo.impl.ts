import { Injectable } from '@nestjs/common';
import { SealRepository } from '../../../app/datastore/community/Seal.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SealDocument } from '../../persistence/community/Seal.schema';
import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealMapper } from '../../services/community/SealMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SealRepositoryImpl extends SealRepository {
	constructor(
		@InjectModel('Seal')
		private readonly sealModel: Model<SealDocument>,
	) {
		super();
	}

	async getAll(): Promise<Seal[]> {
		const docs = await this.sealModel.find().exec();
		return docs.map((doc) => SealMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Seal | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.sealModel.findById(objectId).exec();
		return doc ? SealMapper.fromDocument(doc) : null;
	}

	async create(seal: Seal): Promise<Seal> {
		const plain = SealMapper.toPersistence(seal);
		const created = new this.sealModel(plain);
		const savedSeal = await created.save();
		return SealMapper.fromDocument(savedSeal);
	}

	async update(id: string, seal: Seal): Promise<Seal> {
		const plain = SealMapper.toPersistence(seal);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.sealModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return SealMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.sealModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
