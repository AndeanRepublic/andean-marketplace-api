import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityRepository as CommunityRepositoryBase } from '../../app/datastore/community.repo';
import { Community } from '../../domain/entities/community/Community';
import { CommunityDocument } from '../persistence/community.schema';
import { CommunityMapper } from '../services/CommunityMapper';

@Injectable()
export class CommunityRepositoryImpl extends CommunityRepositoryBase {
	constructor(
		@InjectModel('Community') private communityModel: Model<CommunityDocument>,
	) {
		super();
	}

	async create(community: Community): Promise<Community> {
		const plain = CommunityMapper.toPersistence(community);
		const created = new this.communityModel({
			_id: crypto.randomUUID(),
			...plain,
		});
		const savedCommunity = await created.save();
		return CommunityMapper.fromDocument(savedCommunity);
	}

	async getById(id: string): Promise<Community | null> {
		const doc = await this.communityModel.findOne({ id }).exec();
		return doc ? CommunityMapper.fromDocument(doc) : null;
	}

	async getAll(): Promise<Community[]> {
		const docs = await this.communityModel.find().exec();
		return docs.map((doc) => CommunityMapper.fromDocument(doc));
	}

	async getByName(name: string): Promise<Community | null> {
		const document = await this.communityModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		return document ? CommunityMapper.fromDocument(document) : null;
	}

	async update(id: string, community: Community): Promise<Community | null> {
		const plain = CommunityMapper.toPersistence(community);
		const updated = await this.communityModel
			.findOneAndUpdate({ id }, plain, { new: true })
			.exec();
		return updated ? CommunityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		await this.communityModel.deleteOne({ id }).exec();
		return true;
	}
}
