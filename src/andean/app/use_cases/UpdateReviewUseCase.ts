import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { Review } from 'src/andean/domain/entities/Review';
import { ReviewMapper } from 'src/andean/infra/services/ReviewMapper';
import { CreateReviewDto } from 'src/andean/infra/controllers/dto/CreateReviewDto';
import { CustomerProfileRepository } from '../datastore/Customer.repo';
import { TextileProductRepository } from '../datastore/textileProducts/TextileProduct.repo';
import { SuperfoodProductRepository } from '../datastore/superfoods/SuperfoodProduct.repo';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { UpdateReviewDto } from 'src/andean/infra/controllers/dto/UpdateReviewDto';

@Injectable()
export class UpdateReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) { }

	async handle(id: string, dto: UpdateReviewDto): Promise<Review> {
		const reviewFound = await this.reviewRepository.getById(id);
		if (!reviewFound) {
			throw new NotFoundException('Review not found');
		}

		// Validar customerId
		if (dto.customerId) {
			const customerFound =
				await this.customerProfileRepository.getCustomerById(dto.customerId);
			if (!customerFound) {
				throw new NotFoundException('Customer not found');
			}
		}

		// Validar productId según productType
		if (dto.productId && dto.productType) {
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
		}

		// Nota: No permitimos actualizar el mediaId en una review existente
		// Si se necesita cambiar el media, se debe crear una nueva review

		const updatedData: Partial<Review> = {
			...reviewFound,
			...dto,
		};

		const updated = await this.reviewRepository.update(id, updatedData);

		if (!updated) {
			throw new NotFoundException('Failed to update Review');
		}

		return updated;
	}
}
