import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';

@Injectable()
export class DeleteReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
	) {}

	async handle(id: string): Promise<void> {
		const reviewFound = await this.reviewRepository.getById(id);
		if (!reviewFound) {
			throw new NotFoundException('Review not found');
		}
		await this.reviewRepository.delete(id);
		return;
	}
}
