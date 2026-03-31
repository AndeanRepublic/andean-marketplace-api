import { Review } from '../../domain/entities/Review';
import { ProductType } from '../../domain/enums/ProductType';

export abstract class ReviewRepository {
	abstract create(review: Review): Promise<Review>;
	abstract getAll(): Promise<Review[]>;
	abstract getById(id: string): Promise<Review | null>;
	abstract update(id: string, review: Partial<Review>): Promise<Review>;
	abstract delete(id: string): Promise<void>;
	abstract getByProductIdAndType(
		productId: string,
		productType: ProductType,
	): Promise<Review[]>;
	abstract addLike(reviewId: string, userId: string): Promise<Review>;
	abstract removeLike(reviewId: string, userId: string): Promise<Review>;
	abstract addDislike(reviewId: string, userId: string): Promise<Review>;
	abstract removeDislike(reviewId: string, userId: string): Promise<Review>;
}
