import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { VoteResult } from '../models/review/VoteResult';

@Injectable()
export class DecrementLikesUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
	) {}

	async handle(reviewId: string, userId: string): Promise<VoteResult> {
		const review = await this.reviewRepository.removeLike(reviewId, userId);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		const userVote = review.likedBy?.includes(userId)
			? 'like'
			: review.dislikedBy?.includes(userId)
				? 'dislike'
				: null;

		return {
			numberLikes: review.numberLikes,
			numberDislikes: review.numberDislikes,
			userVote,
		};
	}
}
