import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import {
	SegmindRepository,
	SegmindTryOnResult,
} from '../../datastore/Segmind.repo';
import { StorageRepository } from '../../datastore/Storage.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import {
	TryOnImageOptimizerRepository,
	TryOnOptimizedImage,
} from '../../datastore/TryOnImageOptimizer.repo';
import { TryOnResponse } from '../../models/tryOn/TryOnResponse';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';
import { UploadedFile } from '../../models/shared/UploadedFile';
import type { MediaItem } from '../../../domain/entities/MediaItem';

const PRESIGNED_URL_TTL_SECONDS = 300; // 5 minutes

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
		private readonly tryOnImageOptimizer: TryOnImageOptimizerRepository,
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

		// 2. Buscar los MediaItems del producto
		const mediaItems = await this.mediaItemRepository.getByIds(
			product.baseInfo.mediaIds ?? [],
		);

		// 3. Seleccionar imagen del producto con fallback: PRODUCT → THUMBNAIL → primera disponible
		const productMediaItem = this.selectProductImage(mediaItems);

		if (!productMediaItem) {
			throw new NotFoundException(
				`No MediaItem found for TextileProduct ${textileProductId}`,
			);
		}

		// 4. Optimizar imagen del usuario (WebP 768px) y preparar outfit URL en PARALELO
		const { optimizedUserImage, outfitImageUrl } =
			await this.prepareImagesInParallel(humanImageFile, productMediaItem.key);

		// 5. Subir la foto optimizada del usuario a S3
		const tempKey = await this.storageRepository.uploadFile(
			optimizedUserImage.buffer,
			'tryon-temp',
			`${randomUUID()}.webp`,
			optimizedUserImage.mimeType,
		);

		// 6. Generar presigned URL para la foto del usuario, llamar a Segmind, y borrar el temp
		let result: SegmindTryOnResult;
		try {
			const presignedUrl = await this.storageRepository.generatePresignedGetUrl(
				tempKey,
				PRESIGNED_URL_TTL_SECONDS,
			);
			result = await this.segmindRepository.tryOn(presignedUrl, outfitImageUrl);
		} finally {
			// Fire-and-forget deletion — no esperamos confirmación
			this.storageRepository.deleteFile(tempKey).catch((deleteErr: unknown) => {
				this.logger.warn(
					`Failed to delete temp file ${tempKey}: ${deleteErr instanceof Error ? deleteErr.message : String(deleteErr)}`,
				);
			});
		}

		return {
			image: result.image,
			mimeType: result.mimeType,
		};
	}

	/**
	 * Prepara ambas imágenes en paralelo con manejo de errores detallado.
	 */
	private async prepareImagesInParallel(
		humanImageFile: UploadedFile,
		productMediaKey: string,
	): Promise<{
		optimizedUserImage: TryOnOptimizedImage;
		outfitImageUrl: string;
	}> {
		const [optimizeResult, presignedResult] = await Promise.allSettled([
			this.tryOnImageOptimizer.optimize(
				humanImageFile.buffer,
				humanImageFile.mimetype,
			),
			this.storageRepository.generatePresignedGetUrl(
				productMediaKey,
				PRESIGNED_URL_TTL_SECONDS,
			),
		]);

		// Verificar resultado de optimización de imagen del usuario
		if (optimizeResult.status === 'rejected') {
			const reason =
				optimizeResult.reason instanceof Error
					? optimizeResult.reason.message
					: String(optimizeResult.reason);
			this.logger.error(`User image optimization failed: ${reason}`);
			throw new InternalServerErrorException(
				`Failed to optimize user image: ${reason}`,
			);
		}

		// Verificar resultado de presigned URL del producto
		if (presignedResult.status === 'rejected') {
			const reason =
				presignedResult.reason instanceof Error
					? presignedResult.reason.message
					: String(presignedResult.reason);
			this.logger.error(`Product image presigned URL failed: ${reason}`);
			throw new InternalServerErrorException(
				`Failed to get product image URL: ${reason}`,
			);
		}

		return {
			optimizedUserImage: optimizeResult.value,
			outfitImageUrl: presignedResult.value,
		};
	}

	/**
	 * Selecciona la mejor imagen disponible para el try-on.
	 * Orden de prioridad: PRODUCT → THUMBNAIL → primera disponible
	 */
	private selectProductImage(mediaItems: MediaItem[]): MediaItem | undefined {
		if (mediaItems.length === 0) {
			return undefined;
		}

		// Prioridad 1: Imagen con role PRODUCT (ideal para try-on)
		const productImage = mediaItems.find(
			(item) => item.role === MediaItemRole.PRODUCT,
		);
		if (productImage) {
			return productImage;
		}

		// Prioridad 2: Thumbnail como fallback
		const thumbnailImage = mediaItems.find(
			(item) => item.role === MediaItemRole.THUMBNAIL,
		);
		if (thumbnailImage) {
			this.logger.debug(`No PRODUCT image found, using THUMBNAIL as fallback`);
			return thumbnailImage;
		}

		// Prioridad 3: Primera imagen disponible
		this.logger.debug(
			`No PRODUCT or THUMBNAIL image found, using first available media`,
		);
		return mediaItems[0];
	}
}
