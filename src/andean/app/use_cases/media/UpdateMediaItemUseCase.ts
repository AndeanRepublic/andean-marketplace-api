import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { UpdateMediaItemDto } from '../../../infra/controllers/dto/media/UpdateMediaItemDto';
import { MediaItemMapper } from '../../../infra/services/MediaItemMapper';

@Injectable()
export class UpdateMediaItemUseCase {
	constructor(private readonly mediaItemRepository: MediaItemRepository) {}

	async execute(id: string, dto: UpdateMediaItemDto): Promise<MediaItem> {
		const existing = await this.mediaItemRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`MediaItem with id ${id} not found`);
		}

		try {
			const updated = MediaItemMapper.fromUpdateDto(dto, existing);
			return await this.mediaItemRepository.update(updated);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			throw new BadRequestException(`Error updating media item: ${message}`);
		}
	}
}
