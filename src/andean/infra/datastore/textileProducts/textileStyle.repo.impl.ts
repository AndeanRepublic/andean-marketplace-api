import { Injectable } from '@nestjs/common';
import { TextileStyleRepository } from '../../../app/datastore/textileProducts/TextileStyle.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileStyleDocument } from '../../persistence/textileProducts/textileStyle.schema';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleMapper } from '../../services/textileProducts/TextileStyleMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextileStyleRepositoryImpl extends TextileStyleRepository {
	constructor(
		@InjectModel('TextileStyle')
		private readonly textileStyleModel: Model<TextileStyleDocument>,
	) {
		super();
	}

	async getAllTextileStyles(): Promise<TextileStyle[]> {
		const docs = await this.textileStyleModel.find().exec();
		return docs.map((doc) => TextileStyleMapper.fromDocument(doc));
	}

	async getTextileStyleById(id: string): Promise<TextileStyle | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textileStyleModel.findById(objectId).exec();
		return doc ? TextileStyleMapper.fromDocument(doc) : null;
	}

	async saveTextileStyle(style: TextileStyle): Promise<TextileStyle> {
		const plain = TextileStyleMapper.toPersistence(style);
		const created = new this.textileStyleModel(plain);
		const savedStyle = await created.save();
		return TextileStyleMapper.fromDocument(savedStyle);
	}

	async createManyTextileStyles(
		styles: TextileStyle[],
	): Promise<TextileStyle[]> {
		const plains = styles.map((style) => {
			const plain = TextileStyleMapper.toPersistence(style);
			return {
				_id: style.id,
				name: plain.name,
			};
		});
		const created = await this.textileStyleModel.insertMany(plains);
		return created.map((doc) =>
			TextileStyleMapper.fromDocument(
				doc as unknown as TextileStyleDocument,
			),
		);
	}

	async updateTextileStyle(
		id: string,
		style: TextileStyle,
	): Promise<TextileStyle> {
		const plain = TextileStyleMapper.toPersistence(style);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileStyleModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return TextileStyleMapper.fromDocument(updated!);
	}

	async deleteTextileStyle(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileStyleModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
