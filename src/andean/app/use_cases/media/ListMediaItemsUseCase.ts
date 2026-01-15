import { Injectable } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';

@Injectable()
export class ListMediaItemsUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(): Promise<MediaItem[]> {
		return await this.mediaItemRepository.getAll();
	}
}
