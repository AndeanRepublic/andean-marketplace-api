import {
	Body,
	Controller,
	Post,
	Get,
	Param,
	Put,
	Delete,
	Patch,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { CurrentUser } from '../core/current-user.decorator';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiConsumes,
} from '@nestjs/swagger';
import { Public } from '../core/public.decorator';
import { CreateReviewUseCase } from 'src/andean/app/use_cases/CreateReviewUseCase';
import { Review } from 'src/andean/domain/entities/Review';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { UpdateReviewDto } from './dto/UpdateReviewDto';
import { ReviewResponse } from 'src/andean/app/modules/review/ReviewResponse';
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

@ApiTags('reviews')
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
	) {}

	@UseGuards(JwtAuthGuard)
	@Post(path_reviews)
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		summary: 'Crear una reseña',
		description:
			'Crea una nueva reseña para un producto. Permite adjuntar una imagen (jpeg, png o webp, máx. 5MB).',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: CreateReviewDto })
	@ApiResponse({
		status: 201,
		description: 'Reseña creada exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Datos de entrada inválidos o archivo no soportado',
	})
	async createReview(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
					new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
				],
				fileIsRequired: false,
			}),
		)
		file: Express.Multer.File | undefined,
		@Body() body: CreateReviewDto,
	): Promise<Review> {
		return this.createReviewUseCase.handle(body, file);
	}

	@Public()
	@Get(path_reviews)
	@ApiOperation({
		summary: 'Obtener todas las reseñas',
		description: 'Retorna la lista completa de reseñas registradas',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de reseñas',
		type: [ReviewResponse],
	})
	async getAllReviews(): Promise<Review[]> {
		return this.getAllReviewsUseCase.handle();
	}

	@Public()
	@Get(path_reviews_id)
	@ApiOperation({
		summary: 'Obtener reseña por ID',
		description: 'Retorna una reseña específica por su ID',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({
		status: 200,
		description: 'Reseña encontrada',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async getByIdReview(@Param('id') id: string): Promise<Review> {
		return this.getByIdReviewUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard)
	@Put(path_reviews_id)
	@ApiOperation({
		summary: 'Actualizar reseña',
		description: 'Actualiza el contenido o puntuación de una reseña existente',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiBody({ type: UpdateReviewDto })
	@ApiResponse({
		status: 200,
		description: 'Reseña actualizada exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
	@ApiResponse({
		status: 403,
		description: 'No autorizado para modificar esta reseña',
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async updateReview(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Param('id') id: string,
		@Body() body: UpdateReviewDto,
	): Promise<Review> {
		return this.updateReviewUseCase.handle(id, requestingUser.userId, body);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(path_reviews_id)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar reseña',
		description: 'Elimina una reseña por su ID',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({ status: 204, description: 'Reseña eliminada exitosamente' })
	@ApiResponse({
		status: 403,
		description: 'No autorizado para eliminar esta reseña',
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async deleteReview(
		@CurrentUser() requestingUser: { userId: string; roles: AccountRole[] },
		@Param('id') id: string,
	): Promise<void> {
		return this.deleteReviewUseCase.handle(
			id,
			requestingUser.userId,
			requestingUser.roles,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(`${path_reviews_id}/likes`)
	@ApiOperation({
		summary: 'Incrementar likes',
		description: 'Suma un like a la reseña indicada',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({
		status: 200,
		description: 'Like registrado exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async incrementLikes(@Param('id') id: string): Promise<Review> {
		return this.incrementLikesUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(`${path_reviews_id}/dislikes`)
	@ApiOperation({
		summary: 'Incrementar dislikes',
		description: 'Suma un dislike a la reseña indicada',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({
		status: 200,
		description: 'Dislike registrado exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async incrementDislikes(@Param('id') id: string): Promise<Review> {
		return this.incrementDislikesUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(`${path_reviews_id}/likes`)
	@ApiOperation({
		summary: 'Decrementar likes',
		description: 'Resta un like a la reseña indicada',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({
		status: 200,
		description: 'Like eliminado exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async decrementLikes(@Param('id') id: string): Promise<Review> {
		return this.decrementLikesUseCase.handle(id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(`${path_reviews_id}/dislikes`)
	@ApiOperation({
		summary: 'Decrementar dislikes',
		description: 'Resta un dislike a la reseña indicada',
	})
	@ApiParam({ name: 'id', description: 'ID de la reseña', type: String })
	@ApiResponse({
		status: 200,
		description: 'Dislike eliminado exitosamente',
		type: ReviewResponse,
	})
	@ApiResponse({ status: 404, description: 'Reseña no encontrada' })
	async decrementDislikes(@Param('id') id: string): Promise<Review> {
		return this.decrementDislikesUseCase.handle(id);
	}
}
