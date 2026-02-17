import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { MediaItemRepository } from '../datastore/MediaItem.repo';
import { StorageRepository } from '../datastore/Storage.repo';
import { CreateReviewDto } from 'src/andean/infra/controllers/dto/CreateReviewDto';
import { Review } from 'src/andean/domain/entities/Review';
import { ReviewMapper } from 'src/andean/infra/services/ReviewMapper';
import { MediaItemMapper } from 'src/andean/infra/services/MediaItemMapper';
import { CustomerProfileRepository } from '../datastore/Customer.repo';
import { TextileProductRepository } from '../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

@Injectable()
export class CreateReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		@Inject(StorageRepository)
		private readonly storageRepository: StorageRepository,
	) { }

	async handle(dto: CreateReviewDto, file?: Express.Multer.File): Promise<Review> {
		// Validar customerId
		const customerFound = await this.customerProfileRepository.getCustomerById(
			dto.customerId,
		);
		if (!customerFound) {
			throw new NotFoundException('Customer not found');
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
