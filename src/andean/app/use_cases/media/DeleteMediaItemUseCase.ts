import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';

@Injectable()
export class DeleteMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(id: string): Promise<void> {
		const existing = await this.mediaItemRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`MediaItem with id ${id} not found`);
		}

		await this.mediaItemRepository.delete(id);
	}
}
