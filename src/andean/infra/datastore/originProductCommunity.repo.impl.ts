import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OriginProductCommunityRepository } from '../../app/datastore/originProductCommunity.repo';
import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';
import { OriginProductCommunityDocument } from '../persistence/originProductCommunity.schema';
import { OriginProductCommunityMapper } from '../services/OriginProductCommunityMapper';

@Injectable()
export class OriginProductCommunityRepositoryImpl extends OriginProductCommunityRepository {
	constructor(
		@InjectModel('OriginProductCommunity') private communityModel: Model<OriginProductCommunityDocument>,
	) {
		super();
	}

	async create(community: OriginProductCommunity): Promise<OriginProductCommunity> {
		const document = {
			id: community.id,
			name: community.name,
			regionId: community.regionId,
			createdAt: community.createdAt,
			updatedAt: community.updatedAt,
		};
		const created = await this.communityModel.create(document);
		return OriginProductCommunityMapper.fromDocument(created);
	}

	async findById(id: string): Promise<OriginProductCommunity | null> {
		const document = await this.communityModel.findOne({ id }).exec();
		return document ? OriginProductCommunityMapper.fromDocument(document) : null;
	}

	async findAll(): Promise<OriginProductCommunity[]> {
		const documents = await this.communityModel.find().exec();
		return documents.map((doc) => OriginProductCommunityMapper.fromDocument(doc));
	}

	async findByName(name: string): Promise<OriginProductCommunity | null> {
		const document = await this.communityModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		return document ? OriginProductCommunityMapper.fromDocument(document) : null;
	}

	async findByRegionId(regionId: string): Promise<OriginProductCommunity[]> {
		const documents = await this.communityModel.find({ regionId }).exec();
		return documents.map((doc) => OriginProductCommunityMapper.fromDocument(doc));
	}

	async update(id: string, community: Partial<OriginProductCommunity>): Promise<OriginProductCommunity | null> {
		const updateData = {
			...community,
			updatedAt: new Date(),
		};

		const updated = await this.communityModel
			.findOneAndUpdate({ id }, updateData, { new: true })
			.exec();

		return updated ? OriginProductCommunityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.communityModel.deleteOne({ id }).exec();
		return result.deletedCount > 0;
	}
}
