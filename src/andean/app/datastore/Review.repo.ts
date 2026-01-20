import { Review } from '../../domain/entities/Review';

export abstract class ReviewRepository {
	abstract create(review: Review): Promise<Review>;
	abstract getAll(): Promise<Review[]>;
	abstract getById(id: string): Promise<Review | null>;
	abstract update(id: string, review: Review): Promise<Review>;
	abstract delete(id: string): Promise<void>;
}
