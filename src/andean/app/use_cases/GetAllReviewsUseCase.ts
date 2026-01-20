import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { Review } from 'src/andean/domain/entities/Review';

@Injectable()
export class GetAllReviewsUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
	) {}

	async handle(): Promise<Review[]> {
		const reviews = await this.reviewRepository.getAll();
		if (reviews.length === 0) {
			throw new NotFoundException('No reviews found');
		}
		return reviews;
	}
}
