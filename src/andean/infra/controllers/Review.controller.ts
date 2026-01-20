import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { CreateReviewUseCase } from 'src/andean/app/use_cases/CreateReviewUseCase';
import { Review } from 'src/andean/domain/entities/Review';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { GetAllReviewsUseCase } from 'src/andean/app/use_cases/GetAllReviewsUseCase';
import { GetByIdReviewUseCase } from 'src/andean/app/use_cases/GetByIdReviewUseCase';
import { UpdateReviewUseCase } from 'src/andean/app/use_cases/UpdateReviewUseCase';
import { DeleteReviewUseCase } from 'src/andean/app/use_cases/DeleteReviewUseCase';

const path_reviews = '/';
const path_reviews_id = '/:id';

@Controller('reviews')
export class ReviewController {
	constructor(
		private readonly createReviewUseCase: CreateReviewUseCase,
		private readonly getAllReviewsUseCase: GetAllReviewsUseCase,
		private readonly getByIdReviewUseCase: GetByIdReviewUseCase,
		private readonly updateReviewUseCase: UpdateReviewUseCase,
		private readonly deleteReviewUseCase: DeleteReviewUseCase,
	) {}

	@Post(path_reviews)
	async createReview(@Body() body: CreateReviewDto): Promise<Review> {
		return this.createReviewUseCase.handle(body);
	}

	@Get(path_reviews)
	async getAllReviews(): Promise<Review[]> {
		return this.getAllReviewsUseCase.handle();
	}

	@Get(path_reviews_id)
	async getByIdReview(@Param('id') id: string): Promise<Review> {
		return this.getByIdReviewUseCase.handle(id);
	}

	@Put(path_reviews_id)
	async updateReview(
		@Param('id') id: string,
		@Body() body: CreateReviewDto,
	): Promise<Review> {
		return this.updateReviewUseCase.handle(id, body);
	}

	@Delete(path_reviews_id)
	async deleteReview(@Param('id') id: string): Promise<void> {
		return this.deleteReviewUseCase.handle(id);
	}
}
