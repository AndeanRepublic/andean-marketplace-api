import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperfoodSizeOptionAlternativeRepository } from '../../../app/datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import {
	SuperfoodSizeOptionAlternativeDocument,
} from '../../persistence/superfood/superfoodSizeOptionAlternative.schema';
import { SizeOptionAlternative } from '../../../domain/entities/superfoods/SizeOptionAlternative';
import { SuperfoodSizeOptionAlternativeMapper } from '../../services/superfood/SuperfoodSizeOptionAlternativeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SuperfoodSizeOptionAlternativeRepoImpl extends SuperfoodSizeOptionAlternativeRepository {
	constructor(
		@InjectModel('SuperfoodSizeOptionAlternative')
		private readonly model: Model<SuperfoodSizeOptionAlternativeDocument>,
	) {
		super();
	}

	async createMany(
		sizeOptionAlternatives: SizeOptionAlternative[],
	): Promise<SizeOptionAlternative[]> {
		if (!sizeOptionAlternatives.length) return [];
		const docs = await this.model.insertMany(
			sizeOptionAlternatives.map((item) =>
				SuperfoodSizeOptionAlternativeMapper.toPersistence(item),
			),
		);
		return docs.map((doc) =>
			SuperfoodSizeOptionAlternativeMapper.fromDocument(
				doc as unknown as SuperfoodSizeOptionAlternativeDocument,
			),
		);
	}

	async getByIds(ids: string[]): Promise<SizeOptionAlternative[]> {
		if (!ids.length) return [];
		const objectIds = ids
			.map((id) => {
				try {
					return MongoIdUtils.stringToObjectId(id);
				} catch {
					return null;
				}
			})
			.filter((x): x is NonNullable<typeof x> => x !== null);
		if (!objectIds.length) return [];
		const docs = await this.model.find({ _id: { $in: objectIds } }).exec();
		return docs.map((doc) => SuperfoodSizeOptionAlternativeMapper.fromDocument(doc));
	}

	async deleteManyByIds(ids: string[]): Promise<void> {
		if (!ids.length) return;
		const objectIds = ids
			.map((id) => {
				try {
					return MongoIdUtils.stringToObjectId(id);
				} catch {
					return null;
				}
			})
			.filter((x): x is NonNullable<typeof x> => x !== null);
		if (!objectIds.length) return;
		await this.model.deleteMany({ _id: { $in: objectIds } }).exec();
	}
}
