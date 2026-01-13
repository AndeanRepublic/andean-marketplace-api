import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICommunityRepository } from '../../app/datastore/community.repository.interface';
import { Community } from '../../domain/entities/community/Community';
import { CommunityDocument } from '../persistence/community.schema';
import { CommunityMapper } from '../services/CommunityMapper';

@Injectable()
export class CommunityRepository implements ICommunityRepository {
	constructor(
		@InjectModel('Community') private communityModel: Model<CommunityDocument>,
	) { }

	async create(community: Community): Promise<Community> {
		const document = {
			id: community.id,
			name: community.name,
			createdAt: community.createdAt,
			updatedAt: community.updatedAt,
		};
		const created = await this.communityModel.create(document);
		return CommunityMapper.fromDocument(created);
	}

	async findById(id: string): Promise<Community | null> {
		const document = await this.communityModel.findOne({ id }).exec();
		return document ? CommunityMapper.fromDocument(document) : null;
	}

	async findAll(): Promise<Community[]> {
		const documents = await this.communityModel.find().exec();
		return documents.map((doc) => CommunityMapper.fromDocument(doc));
	}

	async findByName(name: string): Promise<Community | null> {
		const document = await this.communityModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		return document ? CommunityMapper.fromDocument(document) : null;
	}

	async update(id: string, community: Partial<Community>): Promise<Community | null> {
		const updateData = {
			...community,
			updatedAt: new Date(),
		};

		const updated = await this.communityModel
			.findOneAndUpdate({ id }, updateData, { new: true })
			.exec();

		return updated ? CommunityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.communityModel.deleteOne({ id }).exec();
		return result.deletedCount > 0;
	}
}
