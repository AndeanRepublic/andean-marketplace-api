import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceMediaInfoRepository } from '../../../app/datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceMediaInfo } from 'src/andean/domain/entities/experiences/ExperienceMediaInfo';
import { ExperienceMediaInfoDocument } from '../../persistence/experiences/experienceMediaInfo.schema';
import { ExperienceMediaInfoMapper } from '../../services/experiences/ExperienceMediaInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceMediaInfoRepositoryImpl extends ExperienceMediaInfoRepository {
	constructor(
		@InjectModel('ExperienceMediaInfo')
		private readonly model: Model<ExperienceMediaInfoDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperienceMediaInfo[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceMediaInfoMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperienceMediaInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceMediaInfoMapper.fromDocument(doc) : null;
	}

	async save(entity: ExperienceMediaInfo): Promise<ExperienceMediaInfo> {
		const plain = ExperienceMediaInfoMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceMediaInfoMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<ExperienceMediaInfo>,
	): Promise<ExperienceMediaInfo> {
		const plain = ExperienceMediaInfoMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceMediaInfoMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
