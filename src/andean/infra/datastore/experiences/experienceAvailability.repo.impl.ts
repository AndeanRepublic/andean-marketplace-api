import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceAvailabilityRepository } from '../../../app/datastore/experiences/ExperienceAvailability.repo';
import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { ExperienceAvailabilityDocument } from '../../persistence/experiences/experienceAvailability.schema';
import { ExperienceAvailabilityMapper } from '../../services/experiences/ExperienceAvailabilityMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceAvailabilityRepositoryImpl extends ExperienceAvailabilityRepository {
	constructor(
		@InjectModel('ExperienceAvailability')
		private readonly model: Model<ExperienceAvailabilityDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperienceAvailability[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceAvailabilityMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperienceAvailability | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceAvailabilityMapper.fromDocument(doc) : null;
	}

	async save(entity: ExperienceAvailability): Promise<ExperienceAvailability> {
		const plain = ExperienceAvailabilityMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceAvailabilityMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<ExperienceAvailability>,
	): Promise<ExperienceAvailability> {
		const plain = ExperienceAvailabilityMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceAvailabilityMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
