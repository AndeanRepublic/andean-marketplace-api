import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { SegmindRepository } from '../../datastore/Segmind.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TryOnResponse } from '../../modules/tryOn/TryOnResponse';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';

export interface TryOnInput {
	humanImageFile: Express.Multer.File;
	textileProductId: string;
}

@Injectable()
export class TryOnUseCase {
	private readonly storageBaseUrl: string;

	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly segmindRepository: SegmindRepository,
		private readonly textileProductRepository: TextileProductRepository,
		private readonly configService: ConfigService,
	) {
		this.storageBaseUrl = this.configService.get<string>(
			'STORAGE_BASE_URL',
			'',
		);
	}

	async execute(input: TryOnInput): Promise<TryOnResponse> {
		const { humanImageFile, textileProductId } = input;

		// 1. Buscar el producto textil por ID
		const product =
			await this.textileProductRepository.getTextileProductById(
				textileProductId,
			);
		if (!product) {
			throw new NotFoundException(
				`TextileProduct with id ${textileProductId} not found`,
			);
		}

		// 2. Obtener la descripción de la prenda desde baseInfo
		const garmentDescription = product.baseInfo.description;

		// 3. Buscar los MediaItems del producto y filtrar el que tenga role PRODUCT
		const mediaItems = await this.mediaItemRepository.getByIds(
			product.baseInfo.mediaIds ?? [],
		);

		const productMediaItem = mediaItems.find(
			(item) => item.role === MediaItemRole.PRODUCT,
		);

		if (!productMediaItem) {
			throw new NotFoundException(
				`No MediaItem with role PRODUCT found for TextileProduct ${textileProductId}`,
			);
		}

		// 4. Construir la URL de CloudFront de la prenda
		const garmentImageUrl = `${this.storageBaseUrl}/${productMediaItem.key}`;

		// 5. Convertir la imagen del usuario a base64 para mandarla a Segmind
		const humanImageBase64 = `data:${humanImageFile.mimetype};base64,${humanImageFile.buffer.toString('base64')}`;

		// 6. Llamar a Segmind IDM-VTON
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
