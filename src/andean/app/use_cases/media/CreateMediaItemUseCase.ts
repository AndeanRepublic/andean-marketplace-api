import { Injectable, BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { CreateMediaItemDto } from '../../../infra/controllers/dto/media/CreateMediaItemDto';
import { MediaItemMapper } from '../../../infra/services/MediaItemMapper';

@Injectable()
export class CreateMediaItemUseCase {
	constructor(private readonly mediaItemRepository: MediaItemRepository) { }

	async execute(dto: CreateMediaItemDto): Promise<MediaItem> {
		try {
			const mediaItem = MediaItemMapper.fromCreateDto(dto);
			return await this.mediaItemRepository.create(mediaItem);
		} catch (error: any) {
			throw new BadRequestException(
				`Error creating media item: ${error.message}`,
			);
		}
	}
}
