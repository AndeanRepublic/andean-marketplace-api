import { Injectable } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../../app/datastore/textileProducts/TextilePrincipalUse.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TextilePrincipalUseDocument } from '../../persistence/textileProducts/textilePrincipalUse.schema';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseMapper } from '../../services/textileProducts/TextilePrincipalUseMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextilePrincipalUseRepositoryImpl extends TextilePrincipalUseRepository {
	constructor(
		@InjectModel('TextilePrincipalUse')
		private readonly textilePrincipalUseModel: Model<TextilePrincipalUseDocument>,
	) {
		super();
	}

	async getAllTextilePrincipalUses(): Promise<TextilePrincipalUse[]> {
		const docs = await this.textilePrincipalUseModel.find().exec();
		return docs.map((doc) => TextilePrincipalUseMapper.fromDocument(doc));
	}

	async getTextilePrincipalUseById(
		id: string,
	): Promise<TextilePrincipalUse | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textilePrincipalUseModel.findById(objectId).exec();
		return doc ? TextilePrincipalUseMapper.fromDocument(doc) : null;
	}

	async saveTextilePrincipalUse(
		principalUse: TextilePrincipalUse,
	): Promise<TextilePrincipalUse> {
		const plain = TextilePrincipalUseMapper.toPersistence(principalUse);
		const created = new this.textilePrincipalUseModel(plain);
		const savedPrincipalUse = await created.save();
		return TextilePrincipalUseMapper.fromDocument(savedPrincipalUse);
	}

	async createManyTextilePrincipalUses(
		principalUses: TextilePrincipalUse[],
	): Promise<TextilePrincipalUse[]> {
		const plains = principalUses.map((principalUse) => {
			const plain = TextilePrincipalUseMapper.toPersistence(principalUse);
			return {
				_id: principalUse.id,
				name: plain.name,
			};
		});
		const created =
			await this.textilePrincipalUseModel.insertMany(plains);
		return created.map((doc) =>
			TextilePrincipalUseMapper.fromDocument(
				doc as unknown as TextilePrincipalUseDocument,
			),
		);
	}

	async updateTextilePrincipalUse(
		id: string,
		principalUse: TextilePrincipalUse,
	): Promise<TextilePrincipalUse> {
		const plain = TextilePrincipalUseMapper.toPersistence(principalUse);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textilePrincipalUseModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return TextilePrincipalUseMapper.fromDocument(updated!);
	}

	async deleteTextilePrincipalUse(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textilePrincipalUseModel.findByIdAndDelete(objectId).exec();
		return;
	}
}
