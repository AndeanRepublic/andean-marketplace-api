import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import {
	SegmindRepository,
	SegmindTryOnResult,
} from '../../datastore/Segmind.repo';
import { StorageRepository } from '../../datastore/Storage.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TryOnResponse } from '../../models/tryOn/TryOnResponse';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';
import { UploadedFile } from '../../models/shared/UploadedFile';

const PRESIGNED_URL_TTL_SECONDS = 300; // 5 minutes

const MIME_TO_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
};

export interface TryOnInput {
	humanImageFile: UploadedFile;
	textileProductId: string;
}

@Injectable()
export class TryOnUseCase {
	private readonly logger = new Logger(TryOnUseCase.name);

	constructor(
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly segmindRepository: SegmindRepository,
		private readonly storageRepository: StorageRepository,
		private readonly textileProductRepository: TextileProductRepository,
		private readonly configService: ConfigService,
	) {}

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

		// 2. Buscar los MediaItems del producto y filtrar el que tenga role PRODUCT
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

		// 3. Generar presigned URL de S3 para la prenda (outfit)
		const outfitImageUrl = await this.storageRepository.generatePresignedGetUrl(
			productMediaItem.key,
			PRESIGNED_URL_TTL_SECONDS,
		);

		// 4. Subir la foto del usuario a S3 en un prefijo temporal
		const ext = MIME_TO_EXT[humanImageFile.mimetype] ?? 'jpg';
		const tempKey = await this.storageRepository.uploadFile(
			humanImageFile.buffer,
			'tryon-temp',
			`${randomUUID()}.${ext}`,
			humanImageFile.mimetype,
		);

		// 5. Generar presigned URL para la foto del usuario, llamar a Segmind, y borrar el temp
		let result: SegmindTryOnResult;
		try {
			const presignedUrl = await this.storageRepository.generatePresignedGetUrl(
				tempKey,
				PRESIGNED_URL_TTL_SECONDS,
			);
			result = await this.segmindRepository.tryOn(presignedUrl, outfitImageUrl);
		} finally {
			try {
				await this.storageRepository.deleteFile(tempKey);
			} catch (deleteErr: unknown) {
				this.logger.warn(
					`Failed to delete temp file ${tempKey}: ${deleteErr instanceof Error ? deleteErr.message : String(deleteErr)}`,
				);
			}
		}

		return {
			image: result.image,
			mimeType: result.mimeType,
		};
	}
}
