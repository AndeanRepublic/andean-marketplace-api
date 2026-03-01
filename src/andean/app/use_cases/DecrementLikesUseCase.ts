import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { Review } from 'src/andean/domain/entities/Review';

@Injectable()
export class DecrementLikesUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
	) {}

	async handle(id: string): Promise<Review> {
		const reviewFound = await this.reviewRepository.getById(id);
		if (!reviewFound) {
			throw new NotFoundException('Review not found');
		}
		if (reviewFound.numberLikes === 0) {
			throw new BadRequestException('Review already has 0 likes');
		}
		return this.reviewRepository.decrementLikes(id);
	}
}
