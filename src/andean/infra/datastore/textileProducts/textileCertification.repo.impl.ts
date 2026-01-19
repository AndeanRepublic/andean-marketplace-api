import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TextileCertificationRepository } from '../../../app/datastore/textileProducts/TextileCertification.repo';
import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';
import { TextileCertificationDocument } from '../../persistence/textileProducts/textileCertification.schema';
import { TextileCertificationMapper } from '../../services/textileProducts/TextileCertificationMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class TextileCertificationRepositoryImpl extends TextileCertificationRepository {
	constructor(
		@InjectModel('TextileCertification')
		private readonly textileCertificationModel: Model<TextileCertificationDocument>,
	) {
		super();
	}

	async getAllTextileCertifications(): Promise<TextileCertification[]> {
		const docs = await this.textileCertificationModel.find().exec();
		return docs.map((doc: TextileCertificationDocument) =>
			TextileCertificationMapper.fromDocument(doc),
		);
	}

	async getTextileCertificationById(
		id: string,
	): Promise<TextileCertification | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.textileCertificationModel.findById(objectId).exec();
		return doc ? TextileCertificationMapper.fromDocument(doc) : null;
	}

	async saveTextileCertification(
		certification: TextileCertification,
	): Promise<TextileCertification> {
		const plain = TextileCertificationMapper.toPersistence(certification);
		const created = new this.textileCertificationModel(plain);
		const saved = await created.save();
		return TextileCertificationMapper.fromDocument(saved);
	}

	async updateTextileCertification(
		id: string,
		certification: TextileCertification,
	): Promise<TextileCertification> {
		const plain = TextileCertificationMapper.toPersistence(certification);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.textileCertificationModel
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		if (!updated) {
			throw new Error('TextileCertification not found');
		}
		return TextileCertificationMapper.fromDocument(updated);
	}

	async deleteTextileCertification(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.textileCertificationModel.findByIdAndDelete(objectId).exec();
	}
}
