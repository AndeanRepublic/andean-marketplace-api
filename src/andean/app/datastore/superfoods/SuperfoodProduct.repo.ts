import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';

export abstract class SuperfoodProductRepository {
	abstract getSuperfoodProductById(
		id: string,
	): Promise<SuperfoodProduct | null>;

	abstract getAllByOwnerId(ownerId: string): Promise<SuperfoodProduct[]>;

	abstract getAllByCategoryId(categoryId: string): Promise<SuperfoodProduct[]>;

	abstract getAllByStatus(status: string): Promise<SuperfoodProduct[]>;

	abstract saveSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct>;

	abstract updateSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct>;

	abstract deleteSuperfoodProduct(id: string): Promise<void>;
}
