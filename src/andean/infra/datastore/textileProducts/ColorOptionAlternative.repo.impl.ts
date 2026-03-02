import { Injectable } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../../app/datastore/textileProducts/ColorOptionAlternative.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ColorOptionAlternativeDocument } from '../../persistence/textileProducts/ColorOptionAlternative.schema';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeMapper } from '../../services/textileProducts/ColorOptionAlternativeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ColorOptionAlternativeRepositoryImpl extends ColorOptionAlternativeRepository {
	constructor(
		@InjectModel('ColorOptionAlternative')
		private readonly colorOptionAlternativeModel: Model<ColorOptionAlternativeDocument>,
	) {
		super();
	}

	async create(
		colorOptionAlternative: ColorOptionAlternative,
	): Promise<ColorOptionAlternative> {
		const plain = ColorOptionAlternativeMapper.toPersistence(
			colorOptionAlternative,
		);
		const created = new this.colorOptionAlternativeModel(plain);
		const savedColorOptionAlternative = await created.save();
		return ColorOptionAlternativeMapper.fromDocument(
			savedColorOptionAlternative,
		);
	}

	async createMany(
		colorOptionAlternatives: ColorOptionAlternative[],
	): Promise<ColorOptionAlternative[]> {
		const plains = colorOptionAlternatives.map((colorOptionAlternative) => {
			const plain = ColorOptionAlternativeMapper.toPersistence(
				colorOptionAlternative,
			);
			// El schema tiene _id: String, necesitamos proporcionarlo explícitamente
			// Usamos el id de la entidad que ya fue generado como ObjectId string
			return {
				_id: colorOptionAlternative.id,
				nameLabel: plain.nameLabel,
				hexCode: plain.hexCode,
			};
		});
		const created = await this.colorOptionAlternativeModel.insertMany(plains);
		return created.map((doc) =>
			ColorOptionAlternativeMapper.fromDocument(
				doc as unknown as ColorOptionAlternativeDocument,
			),
		);
	}

	async getAll(): Promise<ColorOptionAlternative[]> {
		const docs = await this.colorOptionAlternativeModel.find().exec();
		return docs.map((doc) => ColorOptionAlternativeMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ColorOptionAlternative | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.colorOptionAlternativeModel
			.findById(objectId)
			.exec();
		return doc ? ColorOptionAlternativeMapper.fromDocument(doc) : null;
	}

	async update(
		id: string,
		colorOptionAlternative: ColorOptionAlternative,
	): Promise<ColorOptionAlternative> {
		const plain = ColorOptionAlternativeMapper.toPersistence(
			colorOptionAlternative,
		);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.colorOptionAlternativeModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ColorOptionAlternativeMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.colorOptionAlternativeModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
