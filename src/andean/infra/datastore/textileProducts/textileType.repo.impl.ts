import { Injectable } from '@nestjs/common';
import { TextileTypeRepository } from '../../../app/datastore/textileProducts/TextileType.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextileTypeDocument } from '../../persistence/textileProducts/textileType.schema';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeMapper } from '../../services/textileProducts/TextileTypeMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextileTypeRepositoryImpl extends TextileTypeRepository {
	constructor(
		@InjectModel('TextileType')
		private readonly textileTypeModel: Model<TextileTypeDocument>,
	) {
		super();
	}

	async getAllTextileTypes(): Promise<TextileType[]> {
		const docs = await this.textileTypeModel.find().exec();
		return docs.map((doc) => TextileTypeMapper.fromDocument(doc));
	}

	async getTextileTypeById(id: string): Promise<TextileType | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textileTypeModel.findById(objectId).exec();
		return doc ? TextileTypeMapper.fromDocument(doc) : null;
	}

	async saveTextileType(type: TextileType): Promise<TextileType> {
		const plain = TextileTypeMapper.toPersistence(type);
		const created = new this.textileTypeModel(plain);
		const savedType = await created.save();
		return TextileTypeMapper.fromDocument(savedType);
	}

	async updateTextileType(id: string, type: TextileType): Promise<TextileType> {
		const plain = TextileTypeMapper.toPersistence(type);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileTypeModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return TextileTypeMapper.fromDocument(updated!);
	}

	async deleteTextileType(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileTypeModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
