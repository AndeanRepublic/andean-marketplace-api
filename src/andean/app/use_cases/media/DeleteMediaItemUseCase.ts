import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { StorageRepository } from '../../datastore/Storage.repo';

@Injectable()
export class DeleteMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly storageRepository: StorageRepository,
	) {}

	async execute(id: string): Promise<void> {
		const existing = await this.mediaItemRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`MediaItem with id ${id} not found`);
		}

		await this.storageRepository.deleteFile(existing.key);
		await this.mediaItemRepository.delete(id);
	}
}
