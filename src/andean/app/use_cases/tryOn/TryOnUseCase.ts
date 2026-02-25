import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { SegmindRepository } from '../../datastore/Segmind.repo';
import { TryOnResponse } from '../../models/tryOn/TryOnResponse';

export interface TryOnInput {
	humanImageFile: Express.Multer.File;
	mediaItemId: string;
	garmentDescription?: string;
}

@Injectable()
export class TryOnUseCase {
	private readonly storageBaseUrl: string;

	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly segmindRepository: SegmindRepository,
		private readonly configService: ConfigService,
	) {
		this.storageBaseUrl = this.configService.get<string>(
			'STORAGE_BASE_URL',
			'',
		);
	}

	async execute(input: TryOnInput): Promise<TryOnResponse> {
		const { humanImageFile, mediaItemId, garmentDescription } = input;

		// 1. Buscar el MediaItem para obtener la URL de la prenda
		const mediaItem = await this.mediaItemRepository.getById(mediaItemId);
		if (!mediaItem) {
			throw new NotFoundException(`MediaItem with id ${mediaItemId} not found`);
		}

		// 2. Construir la URL de CloudFront de la prenda (igual que el controller de mediaItem)
		const garmentImageUrl = `${this.storageBaseUrl}/${mediaItem.key}`;

		// 3. Convertir la imagen del usuario a base64 para mandarla a Segmind
		const humanImageBase64 = `data:${humanImageFile.mimetype};base64,${humanImageFile.buffer.toString('base64')}`;

		// 4. Llamar a Segmind IDM-VTON
		const resultBase64 = await this.segmindRepository.tryOn(
			humanImageBase64,
			garmentImageUrl,
			garmentDescription,
		);

		return {
			image: resultBase64,
			mimeType: 'image/jpeg',
		};
	}
}
