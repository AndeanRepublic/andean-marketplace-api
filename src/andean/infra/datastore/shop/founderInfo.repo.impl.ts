import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FounderInfoRepository } from '../../../app/datastore/shop/FounderInfo.repo';
import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';
import { FounderInfoDocument } from '../../persistence/shop/founderInfo.schema';
import { FounderInfoMapper } from '../../services/shop/FounderInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class FounderInfoRepoImpl extends FounderInfoRepository {
	constructor(
		@InjectModel('FounderInfo')
		private readonly model: Model<FounderInfoDocument>,
	) {
		super();
	}

	async create(data: FounderInfo): Promise<FounderInfo> {
		const { id: _tempId, ...fields } = data;
		const created = new this.model(fields);
		const saved = await created.save();
		return FounderInfoMapper.fromDocument(saved);
	}

	async update(id: string, data: Partial<FounderInfo>): Promise<FounderInfo> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const { id: _id, ...updateFields } = data;
		const updated = await this.model
			.findByIdAndUpdate(objectId, updateFields, { new: true })
			.exec();
		if (!updated) {
			throw new NotFoundException(`FounderInfo with id ${id} not found`);
		}
		return FounderInfoMapper.fromDocument(updated);
	}

	async getById(id: string): Promise<FounderInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? FounderInfoMapper.fromDocument(doc) : null;
	}
}
