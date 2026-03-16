import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderInfoRepository } from '../../app/datastore/ProviderInfo.repo';
import { ProviderInfo } from '../../domain/entities/ProviderInfo';
import { ProviderInfoDocument } from '../persistence/providerInfo.schema';
import { ProviderInfoMapper } from '../services/ProviderInfoMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class ProviderInfoRepoImpl extends ProviderInfoRepository {
	constructor(
		@InjectModel('ProviderInfo')
		private readonly providerInfoModel: Model<ProviderInfoDocument>,
	) {
		super();
	}

	async create(providerInfo: ProviderInfo): Promise<ProviderInfo> {
		// Exclude the temporary id — MongoDB generates _id automatically
		const { id: _tempId, ...fields } = providerInfo;
		const created = new this.providerInfoModel(fields);
		const saved = await created.save();
		return ProviderInfoMapper.fromDocument(saved);
	}

	async update(id: string, data: Partial<ProviderInfo>): Promise<ProviderInfo> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.providerInfoModel
			.findByIdAndUpdate(objectId, data, { new: true })
			.exec();
		if (!updated) {
			throw new NotFoundException(`ProviderInfo with id ${id} not found`);
		}
		return ProviderInfoMapper.fromDocument(updated);
	}

	async getById(id: string): Promise<ProviderInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.providerInfoModel.findById(objectId).exec();
		return doc ? ProviderInfoMapper.fromDocument(doc) : null;
	}
}
