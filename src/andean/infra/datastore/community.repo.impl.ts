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
		// MongoDB genera automáticamente el _id como ObjectId
		const created = new this.communityModel(plain);
		const savedCommunity = await created.save();
		return CommunityMapper.fromDocument(savedCommunity);
	}

	async getById(id: string): Promise<Community | null> {
		// Convertir string a ObjectId para la consulta
		const objectId = CommunityMapper.toObjectId(id);
		const doc = await this.communityModel.findById(objectId).exec();
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
		// Convertir string a ObjectId para la consulta
		const objectId = CommunityMapper.toObjectId(id);
		const updated = await this.communityModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return updated ? CommunityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		// Convertir string a ObjectId para la consulta
		const objectId = CommunityMapper.toObjectId(id);
		await this.communityModel.findByIdAndDelete(objectId).exec();
		return true;
	}
}
