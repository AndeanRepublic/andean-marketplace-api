import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceRepository } from '../../../app/datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceDocument } from '../../persistence/experiences/experience.schema';
import { ExperienceMapper } from '../../services/experiences/ExperienceMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceRepositoryImpl extends ExperienceRepository {
	constructor(
		@InjectModel('Experience')
		private readonly model: Model<ExperienceDocument>,
	) {
		super();
	}

	async getAll(): Promise<Experience[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<Experience | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceMapper.fromDocument(doc) : null;
	}

	async save(entity: Experience): Promise<Experience> {
		const plain = ExperienceMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<Experience>,
	): Promise<Experience> {
		const plain = ExperienceMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
