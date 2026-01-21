import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { Review } from 'src/andean/domain/entities/Review';

@Injectable()
export class IncrementDislikesUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
	) {}

	async handle(id: string): Promise<Review> {
		const reviewFound = await this.reviewRepository.getById(id);
		if (!reviewFound) {
			throw new NotFoundException('Review not found');
		}
		return this.reviewRepository.incrementDislikes(id);
	}
}
