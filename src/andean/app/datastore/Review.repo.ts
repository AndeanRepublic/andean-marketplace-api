import { Review } from '../../domain/entities/Review';
import { ProductType } from '../../domain/enums/ProductType';

export abstract class ReviewRepository {
	abstract create(review: Review): Promise<Review>;
	abstract getAll(): Promise<Review[]>;
	abstract getById(id: string): Promise<Review | null>;
	abstract update(id: string, review: Review): Promise<Review>;
	abstract delete(id: string): Promise<void>;
	abstract getByProductIdAndType(productId: string, productType: ProductType): Promise<Review[]>;
}
