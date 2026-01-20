import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { instanceToPlain } from 'class-transformer';
import { CommunityRepository as CommunityRepositoryBase } from '../../../app/datastore/community/community.repo';
import { Community } from '../../../domain/entities/community/Community';
import { CommunityDocument } from '../../persistence/community/community.schema';
import { CommunityMapper } from '../../services/community/CommunityMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

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
		const objectId = MongoIdUtils.stringToObjectId(id);
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

	async update(id: string, community: Partial<Community>): Promise<Community | null> {
		// Convertir Partial<Community> a objeto plano, excluyendo id
		const plain = instanceToPlain(community);
		const { id: _, ...dataForDB } = plain;
		// Convertir string a ObjectId para la consulta
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.communityModel
			.findByIdAndUpdate(objectId, dataForDB, { new: true })
			.exec();
		return updated ? CommunityMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		// Convertir string a ObjectId para la consulta
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.communityModel.findByIdAndDelete(objectId).exec();
		return true;
	}
}
