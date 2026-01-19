import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';

@Injectable()
export class GetMediaItemByIdUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(id: string): Promise<MediaItem> {
		const mediaItem = await this.mediaItemRepository.getById(id);
		if (!mediaItem) {
			throw new NotFoundException(`MediaItem with id ${id} not found`);
		}
		return mediaItem;
	}
}
