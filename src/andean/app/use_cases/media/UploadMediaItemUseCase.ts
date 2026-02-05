import { Injectable, BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { StorageRepository } from '../../datastore/Storage.repo';
import { MediaItemMapper } from '../../../infra/services/MediaItemMapper';

export interface UploadMediaItemInput {
	file: Express.Multer.File;
	type: string;
	name: string;
}

@Injectable()
export class UploadMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly storageRepository: StorageRepository,
	) { }

	async execute(input: UploadMediaItemInput): Promise<MediaItem> {
		const { file, type, name } = input;

		try {
			// 1. Subir archivo a S3
			const url = await this.storageRepository.uploadFile(
				file.buffer,
				type,
				name,
				file.mimetype,
			);

			// 2. Crear entidad MediaItem usando mapper
			const mediaItem = MediaItemMapper.fromUploadData(type, name, url);

			// 3. Guardar en base de datos
			return await this.mediaItemRepository.create(mediaItem);
		} catch (error) {
			throw new BadRequestException(
				`Error uploading media item: ${error.message}`,
			);
		}
	}
}
