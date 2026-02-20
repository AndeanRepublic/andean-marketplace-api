import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceBasicInfoRepository } from '../../../app/datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceBasicInfo } from 'src/andean/domain/entities/experiences/ExperienceBasicInfo';
import { ExperienceBasicInfoDocument } from '../../persistence/experiences/experienceBasicInfo.schema';
import { ExperienceBasicInfoMapper } from '../../services/experiences/ExperienceBasicInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceBasicInfoRepositoryImpl extends ExperienceBasicInfoRepository {
	constructor(
		@InjectModel('ExperienceBasicInfo')
		private readonly model: Model<ExperienceBasicInfoDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperienceBasicInfo[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceBasicInfoMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperienceBasicInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceBasicInfoMapper.fromDocument(doc) : null;
	}

	async save(entity: ExperienceBasicInfo): Promise<ExperienceBasicInfo> {
		const plain = ExperienceBasicInfoMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceBasicInfoMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<ExperienceBasicInfo>,
	): Promise<ExperienceBasicInfo> {
		const plain = ExperienceBasicInfoMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceBasicInfoMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
