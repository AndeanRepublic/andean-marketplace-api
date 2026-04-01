import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { MediaItemRepository } from '../datastore/MediaItem.repo';
import { StorageRepository } from '../datastore/Storage.repo';
import { AccountRepository } from '../datastore/Account.repo';
import { CreateReviewDto } from '../../infra/controllers/dto/CreateReviewDto';
import { Review } from '../../domain/entities/Review';
import { ReviewMapper } from '../../infra/services/ReviewMapper';
import { MediaItemMapper } from '../../infra/services/MediaItemMapper';
import { TextileProductRepository } from '../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from '../../domain/enums/ProductType';
import { MediaItemType } from '../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../domain/enums/MediaItemRole';
import { UploadedFile } from '../../app/models/shared/UploadedFile';

@Injectable()
export class CreateReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		@Inject(StorageRepository)
		private readonly storageRepository: StorageRepository,
	) {}

	async handle(dto: CreateReviewDto, file?: UploadedFile): Promise<Review> {
		// Validar accountId
		const accountFound = await this.accountRepository.getAccountById(
			dto.accountId,
		);
		if (!accountFound) {
			throw new NotFoundException('Account not found');
		}

		// Validar productId según productType
		if (dto.productType === ProductType.TEXTILE) {
			const productFound =
				await this.textileProductRepository.getTextileProductById(
					dto.productId,
				);
			if (!productFound) {
				throw new NotFoundException('TextileProduct not found');
			}
		} else if (dto.productType === ProductType.SUPERFOOD) {
			const productFound =
				await this.superfoodProductRepository.getSuperfoodProductById(
					dto.productId,
				);
			if (!productFound) {
				throw new NotFoundException('SuperfoodProduct not found');
			}
		} else if (dto.productType === ProductType.EXPERIENCE) {
			// TODO: Agregar validación cuando exista ExperienceProductRepository
			// Por ahora solo validamos que el tipo sea válido
		}

		// Crear MediaItem si se proporciona archivo
		let mediaId: string | undefined;
		if (file && dto.mediaType && dto.mediaName) {
			// 1. Subir archivo a S3
			const key = await this.storageRepository.uploadFile(
				file.buffer,
				dto.mediaType,
				dto.mediaName,
				file.mimetype,
			);

			// 2. Crear MediaItem
			const mediaItem = MediaItemMapper.fromUploadData(
				dto.mediaType,
				dto.mediaName,
				key,
				dto.mediaRole ?? MediaItemRole.NONE,
			);

			// 3. Guardar MediaItem en base de datos
			const savedMediaItem = await this.mediaItemRepository.create(mediaItem);
			mediaId = savedMediaItem.id;
		}

		// Crear DTO modificado con el mediaId
		const reviewDto = {
			...dto,
			mediaId,
		};

		const reviewToSave = ReviewMapper.fromCreateDto(reviewDto as any);
		return this.reviewRepository.create(reviewToSave);
	}
}
