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

	async getByIds(ids: string[]): Promise<TextileCertification[]> {
		if (ids.length === 0) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.textileCertificationModel
			.find({ _id: { $in: objectIds } })
			.exec();
		return docs.map((doc: TextileCertificationDocument) =>
			TextileCertificationMapper.fromDocument(doc),
		);
	}

	async getTextileCertificationByName(
		name: string,
	): Promise<TextileCertification | null> {
		const document = await this.textileCertificationModel
			.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
			.exec();
		return document ? TextileCertificationMapper.fromDocument(document) : null;
	}

	async saveTextileCertification(
		certification: TextileCertification,
	): Promise<TextileCertification> {
		const plain = TextileCertificationMapper.toPersistence(certification);
		const created = new this.textileCertificationModel(plain);
		const saved = await created.save();
		return TextileCertificationMapper.fromDocument(saved);
	}

	async createManyTextileCertifications(
		certifications: TextileCertification[],
	): Promise<TextileCertification[]> {
		const plains = certifications.map((certification) => {
			const plain =
				TextileCertificationMapper.toPersistence(certification);
			return {
				_id: certification.id,
				name: plain.name,
			};
		});
		const created =
			await this.textileCertificationModel.insertMany(plains);
		return created.map((doc) =>
			TextileCertificationMapper.fromDocument(
				doc as unknown as TextileCertificationDocument,
			),
		);
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
