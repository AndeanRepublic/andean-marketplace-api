import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItemRepository } from '../../app/datastore/MediaItem.repo';
import { MediaItem } from '../../domain/entities/MediaItem';
import { MediaItemDocument } from '../persistence/mediaItem.schema';
import { MediaItemMapper } from '../services/MediaItemMapper';

@Injectable()
export class MediaItemRepoImpl implements MediaItemRepository {
	constructor(
		@InjectModel('MediaItem')
		private readonly model: Model<MediaItemDocument>,
	) { }

	async getById(id: string): Promise<MediaItem | null> {
		const doc = await this.model.findOne({ id }).exec();
		if (!doc) return null;
		return MediaItemMapper.fromDocument(doc);
	}

	async getAll(): Promise<MediaItem[]> {
		const docs = await this.model.find().exec();
		return docs.map(doc => MediaItemMapper.fromDocument(doc));
	}

	async save(mediaItem: MediaItem): Promise<MediaItem> {
		const persistenceData = MediaItemMapper.toPersistence(mediaItem);
		const newDoc = new this.model({
			_id: crypto.randomUUID(),
			...persistenceData,
		});
		const savedDoc = await newDoc.save();
		return MediaItemMapper.fromDocument(savedDoc);
	}

	async update(mediaItem: MediaItem): Promise<MediaItem> {
		const persistenceData = MediaItemMapper.toPersistence(mediaItem);
		persistenceData.updatedAt = new Date();

		const updatedDoc = await this.model
			.findOneAndUpdate(
				{ id: mediaItem.id },
				{ $set: persistenceData },
				{ new: true }
			)
			.exec();

		if (!updatedDoc) {
			throw new Error('MediaItem not found for update');
		}

		return MediaItemMapper.fromDocument(updatedDoc);
	}

	async delete(id: string): Promise<void> {
		await this.model.deleteOne({ id }).exec();
	}
}
