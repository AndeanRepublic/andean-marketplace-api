import { Injectable, BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { CreateMediaItemDto } from '../../../infra/controllers/dto/media/CreateMediaItemDto';
import * as crypto from 'crypto';

@Injectable()
export class CreateMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(dto: CreateMediaItemDto): Promise<MediaItem> {
		try {
			const mediaItem = new MediaItem(
				crypto.randomUUID(),
				dto.type,
				dto.name,
				dto.url,
				new Date(),
				new Date(),
			);

			return await this.mediaItemRepository.save(mediaItem);
		} catch (error) {
			throw new BadRequestException(`Error creating media item: ${error.message}`);
		}
	}
}
