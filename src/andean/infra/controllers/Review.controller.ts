import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	Patch,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReviewUseCase } from 'src/andean/app/use_cases/CreateReviewUseCase';
import { Review } from 'src/andean/domain/entities/Review';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { UpdateReviewDto } from './dto/UpdateReviewDto';
import { GetAllReviewsUseCase } from 'src/andean/app/use_cases/GetAllReviewsUseCase';
import { GetByIdReviewUseCase } from 'src/andean/app/use_cases/GetByIdReviewUseCase';
import { UpdateReviewUseCase } from 'src/andean/app/use_cases/UpdateReviewUseCase';
import { DeleteReviewUseCase } from 'src/andean/app/use_cases/DeleteReviewUseCase';
import { IncrementLikesUseCase } from 'src/andean/app/use_cases/IncrementLikesUseCase';
import { IncrementDislikesUseCase } from 'src/andean/app/use_cases/IncrementDislikesUseCase';
import { DecrementLikesUseCase } from 'src/andean/app/use_cases/DecrementLikesUseCase';
import { DecrementDislikesUseCase } from 'src/andean/app/use_cases/DecrementDislikesUseCase';

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
		private readonly incrementLikesUseCase: IncrementLikesUseCase,
		private readonly incrementDislikesUseCase: IncrementDislikesUseCase,
		private readonly decrementLikesUseCase: DecrementLikesUseCase,
		private readonly decrementDislikesUseCase: DecrementDislikesUseCase,
	) { }

	@Post(path_reviews)
	@UseInterceptors(FileInterceptor('file'))
	async createReview(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
					new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
				],
				fileIsRequired: false, // El archivo es opcional
			}),
		)
		file: Express.Multer.File | undefined,
		@Body() body: CreateReviewDto,
	): Promise<Review> {
		return this.createReviewUseCase.handle(body, file);
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
		@Body() body: UpdateReviewDto,
	): Promise<Review> {
		return this.updateReviewUseCase.handle(id, body);
	}

	@Delete(path_reviews_id)
	async deleteReview(@Param('id') id: string): Promise<void> {
		return this.deleteReviewUseCase.handle(id);
	}

	@Patch(`${path_reviews_id}/likes`)
	async incrementLikes(@Param('id') id: string): Promise<Review> {
		return this.incrementLikesUseCase.handle(id);
	}

	@Patch(`${path_reviews_id}/dislikes`)
	async incrementDislikes(@Param('id') id: string): Promise<Review> {
		return this.incrementDislikesUseCase.handle(id);
	}

	@Delete(`${path_reviews_id}/likes`)
	async decrementLikes(@Param('id') id: string): Promise<Review> {
		return this.decrementLikesUseCase.handle(id);
	}

	@Delete(`${path_reviews_id}/dislikes`)
	async decrementDislikes(@Param('id') id: string): Promise<Review> {
		return this.decrementDislikesUseCase.handle(id);
	}
}
