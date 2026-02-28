import { Injectable, BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { StorageRepository } from '../../datastore/Storage.repo';
import { MediaItemMapper } from '../../../infra/services/MediaItemMapper';
import { MediaItemType } from '../../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';

export interface UploadMediaItemInput {
	file: Express.Multer.File;
	type: MediaItemType;
	name: string;
	role?: MediaItemRole;
}

@Injectable()
export class UploadMediaItemUseCase {
	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly storageRepository: StorageRepository,
	) {}

	async execute(input: UploadMediaItemInput): Promise<MediaItem> {
		const { file, type, name, role } = input;

		try {
			// 1. Subir archivo a S3 y obtener key
			const key = await this.storageRepository.uploadFile(
				file.buffer,
				type,
				name,
				file.mimetype,
			);

			// 2. Crear entidad MediaItem usando mapper con el key
			const mediaItem = MediaItemMapper.fromUploadData(type, name, key, role);

			// 3. Guardar en base de datos
			return await this.mediaItemRepository.create(mediaItem);
		} catch (error: any) {
			throw new BadRequestException(
				`Error uploading media item: ${error.message}`,
			);
		}
	}
}
