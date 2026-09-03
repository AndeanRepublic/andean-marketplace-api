import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityPageInfoRepository } from '../../../app/datastore/community/CommunityPageInfo.repo';
import { CommunityPageInfo } from '../../../domain/entities/community/CommunityPageInfo';
import { CommunityPageInfoDocument } from '../../persistence/community/communityPageInfo.schema';
import { CommunityPageInfoMapper } from '../../services/community/CommunityPageInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class CommunityPageInfoRepoImpl extends CommunityPageInfoRepository {
	constructor(
		@InjectModel('CommunityPageInfo')
		private readonly model: Model<CommunityPageInfoDocument>,
	) {
		super();
	}

	async create(data: CommunityPageInfo): Promise<CommunityPageInfo> {
		const { id: _tempId, ...fields } = data;
		const created = new this.model(fields);
		const saved = await created.save();
		return CommunityPageInfoMapper.fromDocument(saved);
	}

	async update(id: string, data: Partial<CommunityPageInfo>): Promise<CommunityPageInfo> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const { id: _id, ...updateFields } = data;
		const updated = await this.model
			.findByIdAndUpdate(objectId, updateFields, { new: true })
			.exec();
		if (!updated) {
			throw new NotFoundException(`CommunityPageInfo with id ${id} not found`);
		}
		return CommunityPageInfoMapper.fromDocument(updated);
	}

	async getById(id: string): Promise<CommunityPageInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? CommunityPageInfoMapper.fromDocument(doc) : null;
	}
}
