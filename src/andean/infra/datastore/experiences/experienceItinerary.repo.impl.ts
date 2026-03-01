import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceItineraryRepository } from '../../../app/datastore/experiences/ExperienceItinerary.repo';
import { ExperienceItinerary } from 'src/andean/domain/entities/experiences/ExperienceItinerary';
import { ExperienceItineraryDocument } from '../../persistence/experiences/experienceItinerary.schema';
import { ExperienceItineraryMapper } from '../../services/experiences/ExperienceItineraryMapper';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

@Injectable()
export class ExperienceItineraryRepositoryImpl extends ExperienceItineraryRepository {
	constructor(
		@InjectModel('ExperienceItinerary')
		private readonly model: Model<ExperienceItineraryDocument>,
	) {
		super();
	}

	async getAll(): Promise<ExperienceItinerary[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => ExperienceItineraryMapper.fromDocument(doc));
	}

	async getById(id: string): Promise<ExperienceItinerary | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		return doc ? ExperienceItineraryMapper.fromDocument(doc) : null;
	}

	async getByIds(ids: string[]): Promise<ExperienceItinerary[]> {
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.model
			.find({ _id: { $in: objectIds } })
			.sort({ numberDay: 1 })
			.exec();
		return docs.map((doc) => ExperienceItineraryMapper.fromDocument(doc));
	}

	async save(entity: ExperienceItinerary): Promise<ExperienceItinerary> {
		const plain = ExperienceItineraryMapper.toPersistence(entity);
		const created = new this.model(plain);
		const saved = await created.save();
		return ExperienceItineraryMapper.fromDocument(saved);
	}

	async saveMany(
		entities: ExperienceItinerary[],
	): Promise<ExperienceItinerary[]> {
		const plains = entities.map((e) =>
			ExperienceItineraryMapper.toPersistence(e),
		);
		const docs = await this.model.insertMany(plains);
		return docs.map((doc) =>
			ExperienceItineraryMapper.fromDocument(
				doc as unknown as ExperienceItineraryDocument,
			),
		);
	}

	async update(
		id: string,
		entity: Partial<ExperienceItinerary>,
	): Promise<ExperienceItinerary> {
		const plain = ExperienceItineraryMapper.toPersistence(entity);
		const objectId = MongoIdUtils.stringToObjectId(id);
		const updated = await this.model
			.findByIdAndUpdate(objectId, plain, { new: true })
			.exec();
		return ExperienceItineraryMapper.fromDocument(updated!);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async deleteMany(ids: string[]): Promise<void> {
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		await this.model.deleteMany({ _id: { $in: objectIds } }).exec();
	}
}
