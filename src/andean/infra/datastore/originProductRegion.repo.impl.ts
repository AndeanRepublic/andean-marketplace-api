import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OriginProductRegionRepository } from '../../app/datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';
import { OriginProductRegionDocument } from '../persistence/originProductRegion.schema';
import { OriginProductRegionMapper } from '../services/OriginProductRegionMapper';

@Injectable()
export class OriginProductRegionRepositoryImpl extends OriginProductRegionRepository {
	constructor(
		@InjectModel('OriginProductRegion') private regionModel: Model<OriginProductRegionDocument>,
	) {
		super();
	}

	async create(region: OriginProductRegion): Promise<OriginProductRegion> {
		const document = {
			id: region.id,
			name: region.name,
			createdAt: region.createdAt,
			updatedAt: region.updatedAt,
		};
		const created = await this.regionModel.create(document);
		return OriginProductRegionMapper.fromDocument(created);
	}

	async findById(id: string): Promise<OriginProductRegion | null> {
		const document = await this.regionModel.findOne({ id }).exec();
		return document ? OriginProductRegionMapper.fromDocument(document) : null;
	}

	async findAll(): Promise<OriginProductRegion[]> {
		const documents = await this.regionModel.find().exec();
		return documents.map((doc) => OriginProductRegionMapper.fromDocument(doc));
	}

	async findByName(name: string): Promise<OriginProductRegion | null> {
		const document = await this.regionModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		return document ? OriginProductRegionMapper.fromDocument(document) : null;
	}

	async update(id: string, region: Partial<OriginProductRegion>): Promise<OriginProductRegion | null> {
		const updateData = {
			...region,
			updatedAt: new Date(),
		};

		const updated = await this.regionModel
			.findOneAndUpdate({ id }, updateData, { new: true })
			.exec();

		return updated ? OriginProductRegionMapper.fromDocument(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.regionModel.deleteOne({ id }).exec();
		return result.deletedCount > 0;
	}
}
