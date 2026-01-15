import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { UpdateMediaItemDto } from '../../../infra/controllers/dto/media/UpdateMediaItemDto';

@Injectable()
export class UpdateMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(id: string, dto: UpdateMediaItemDto): Promise<MediaItem> {
		const existing = await this.mediaItemRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`MediaItem with id ${id} not found`);
		}

		try {
			const updated = new MediaItem(
				existing.id,
				dto.type ?? existing.type,
				dto.name ?? existing.name,
				dto.url ?? existing.url,
				existing.createdAt,
				new Date(),
			);

			return await this.mediaItemRepository.update(updated);
		} catch (error) {
			throw new BadRequestException(`Error updating media item: ${error.message}`);
		}
	}
}
