import { Injectable } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../../app/datastore/textileProducts/SizeOptionAlternative.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SizeOptionAlternativeDocument } from '../../persistence/textileProducts/SizeOptionAlternative.schema';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeMapper } from '../../services/textileProducts/SizeOptionAlternativeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class SizeOptionAlternativeRepositoryImpl extends SizeOptionAlternativeRepository {
	constructor(
		@InjectModel('SizeOptionAlternative')
		private readonly sizeOptionAlternativeModel: Model<SizeOptionAlternativeDocument>,
	) {
		super();
	}

	async create(
		sizeOptionAlternative: SizeOptionAlternative,
	): Promise<SizeOptionAlternative> {
		const plain = SizeOptionAlternativeMapper.toPersistence(
			sizeOptionAlternative,
		);
		const created = new this.sizeOptionAlternativeModel(plain);
		const savedSizeOptionAlternative = await created.save();
		return SizeOptionAlternativeMapper.fromDocument(savedSizeOptionAlternative);
	}

	async createMany(
		sizeOptionAlternatives: SizeOptionAlternative[],
	): Promise<SizeOptionAlternative[]> {
		const plains = sizeOptionAlternatives.map((sizeOptionAlternative) => {
			const plain = SizeOptionAlternativeMapper.toPersistence(
				sizeOptionAlternative,
			);
			// Mongoose generará automáticamente el _id como ObjectId
			return plain;
		});
		const created = await this.sizeOptionAlternativeModel.insertMany(plains);
		return created.map((doc) =>
			SizeOptionAlternativeMapper.fromDocument(
				doc as unknown as SizeOptionAlternativeDocument,
			),
		);
	}

	async getAll(): Promise<SizeOptionAlternative[]> {
		const docs = await this.sizeOptionAlternativeModel.find().exec();
		return docs.map((doc) => SizeOptionAlternativeMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<SizeOptionAlternative | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.sizeOptionAlternativeModel.findById(objectId).exec();
		return doc ? SizeOptionAlternativeMapper.fromDocument(doc) : null;
	}

	async update(
		id: string,
		sizeOptionAlternative: SizeOptionAlternative,
	): Promise<SizeOptionAlternative> {
		const plain = SizeOptionAlternativeMapper.toPersistence(
			sizeOptionAlternative,
		);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.sizeOptionAlternativeModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return SizeOptionAlternativeMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.sizeOptionAlternativeModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
