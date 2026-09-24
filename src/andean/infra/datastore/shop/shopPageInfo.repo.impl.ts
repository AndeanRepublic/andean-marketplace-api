import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopPageInfoRepository } from '../../../app/datastore/shop/ShopPageInfo.repo';
import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';
import { ShopPageInfoDocument } from '../../persistence/shop/shopPageInfo.schema';
import { ShopPageInfoMapper } from '../../services/shop/ShopPageInfoMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ShopPageInfoRepoImpl extends ShopPageInfoRepository {
	constructor(
		@InjectModel('ShopPageInfo')
		private readonly model: Model<ShopPageInfoDocument>,
	) {
		super();
	}

	async create(data: ShopPageInfo): Promise<ShopPageInfo> {
		const { id: _tempId, ...fields } = data;
		const created = new this.model(fields);
		const saved = await created.save();
		return ShopPageInfoMapper.fromDocument(saved);
	}

	async update(id: string, data: Partial<ShopPageInfo>): Promise<ShopPageInfo> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const { id: _id, ...updateFields } = data;
		const updated = await this.model
			.findByIdAndUpdate(objectId, updateFields, { new: true })
			.exec();
		if (!updated) {
			throw new NotFoundException(`ShopPageInfo with id ${id} not found`);
		}
		return ShopPageInfoMapper.fromDocument(updated);
	}

	async getById(id: string): Promise<ShopPageInfo | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ShopPageInfoMapper.fromDocument(doc) : null;
	}
}
