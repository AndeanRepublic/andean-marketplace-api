import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceDetailInfoRepository } from '../../../app/datastore/experiences/ExperienceDetailInfo.repo';
import { ExperienceDetailInfo } from 'src/andean/domain/entities/experiences/ExperienceDetailInfo';
import { ExperienceDetailInfoDocument } from '../../persistence/experiences/experienceDetailInfo.schema';
import { ExperienceDetailInfoMapper } from '../../services/experiences/ExperienceDetailInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceDetailInfoRepositoryImpl extends ExperienceDetailInfoRepository {
	constructor(
		@InjectModel('ExperienceDetailInfo')
		private readonly model: Model<ExperienceDetailInfoDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperienceDetailInfo[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceDetailInfoMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperienceDetailInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceDetailInfoMapper.fromDocument(doc) : null;
	}

	async save(entity: ExperienceDetailInfo): Promise<ExperienceDetailInfo> {
		const plain = ExperienceDetailInfoMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceDetailInfoMapper.fromDocument(saved);
	}

	async update(
		id: string,
		entity: Partial<ExperienceDetailInfo>,
	): Promise<ExperienceDetailInfo> {
		const plain = ExperienceDetailInfoMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceDetailInfoMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}
}
