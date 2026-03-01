import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItemRepository } from '../../app/datastore/MediaItem.repo';
import { MediaItem } from '../../domain/entities/MediaItem';
import { MediaItemDocument } from '../persistence/mediaItem.schema';
import { MediaItemMapper } from '../services/MediaItemMapper';
import { MongoIdUtils } from '../utils/MongoIdUtils';

@Injectable()
export class MediaItemRepoImpl implements MediaItemRepository {
	constructor(
		@InjectModel('MediaItem')
		private readonly model: Model<MediaItemDocument>,
	) { }

	async getById(id: string): Promise<MediaItem | null> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		const doc = await this.model.findById(objectId).exec();
		if (!doc) return null;
		return MediaItemMapper.fromDocument(doc);
	}

	async getAll(): Promise<MediaItem[]> {
		const docs = await this.model.find().exec();
		return docs.map((doc) => MediaItemMapper.fromDocument(doc));
	}

	async create(mediaItem: MediaItem): Promise<MediaItem> {
		const persistenceData = MediaItemMapper.toPersistence(mediaItem);
		// MongoDB genera automáticamente el _id como ObjectId
		const newDoc = new this.model(persistenceData);
		const savedDoc = await newDoc.save();
		return MediaItemMapper.fromDocument(savedDoc);
	}

	async update(mediaItem: MediaItem): Promise<MediaItem> {
		const persistenceData = MediaItemMapper.toPersistence(mediaItem);
		persistenceData.updatedAt = new Date();

		const objectId = MongoIdUtils.stringToObjectId(mediaItem.id);
		const updatedDoc = await this.model
			.findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
			.exec();

		if (!updatedDoc) {
			throw new Error('MediaItem not found for update');
		}

		return MediaItemMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		const objectId = MongoIdUtils.stringToObjectId(id);
		await this.model.findByIdAndDelete(objectId).exec();
	}

	async getByIds(ids: string[]): Promise<MediaItem[]> {
		if (!ids.length) return [];
		const objectIds = ids.map((id) => MongoIdUtils.stringToObjectId(id));
		const docs = await this.model.find({ _id: { $in: objectIds } }).exec();
		return docs.map((doc) => MediaItemMapper.fromDocument(doc));
	}
}
