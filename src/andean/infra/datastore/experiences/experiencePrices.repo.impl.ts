import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperiencePricesRepository } from '../../../app/datastore/experiences/ExperiencePrices.repo';
import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { ExperiencePricesDocument } from '../../persistence/experiences/experiencePrices.schema';
import { ExperiencePricesMapper } from '../../services/experiences/ExperiencePricesMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperiencePricesRepositoryImpl extends ExperiencePricesRepository {
	constructor(
		@InjectModel('ExperiencePrices')
		private readonly model: Model<ExperiencePricesDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperiencePrices[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperiencePricesMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperiencePrices | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperiencePricesMapper.fromDocument(doc) : null;
	}

	async save(entity: ExperiencePrices): Promise<ExperiencePrices> {
		const plain = ExperiencePricesMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperiencePricesMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<ExperiencePrices>,
	): Promise<ExperiencePrices> {
		const plain = ExperiencePricesMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperiencePricesMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
