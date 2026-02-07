import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { MediaItemRepository } from '../datastore/MediaItem.repo';
import { CreateReviewDto } from 'src/andean/infra/controllers/dto/CreateReviewDto';
import { Review } from 'src/andean/domain/entities/Review';
import { ReviewMapper } from 'src/andean/infra/services/ReviewMapper';
import { CustomerProfileRepository } from '../datastore/Customer.repo';
import { TextileProductRepository } from '../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from 'src/andean/domain/enums/ProductType';

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
	) { }

	async handle(dto: CreateReviewDto): Promise<Review> {
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

		// Validar que el MediaItem existe si se proporciona
		if (dto.mediaId) {
			const mediaItemFound = await this.mediaItemRepository.getById(
				dto.mediaId,
			);
			if (!mediaItemFound) {
				throw new NotFoundException(`MediaItem with id ${dto.mediaId} not found`);
			}
		}

		const reviewToSave = ReviewMapper.fromCreateDto(dto);
		return this.reviewRepository.create(reviewToSave);
	}
}
