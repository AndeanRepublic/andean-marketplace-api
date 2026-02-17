import { DetailSourceProduct } from '../../domain/entities/superfoods/DetailSourceProduct';

export abstract class DetailSourceProductRepository {
	abstract create(
		detailSourceProduct: DetailSourceProduct,
	): Promise<DetailSourceProduct>;
	abstract getById(id: string): Promise<DetailSourceProduct | null>;
	abstract getAll(): Promise<DetailSourceProduct[]>;
	abstract update(
		id: string,
		detailSourceProduct: Partial<DetailSourceProduct>,
	): Promise<DetailSourceProduct>;
	abstract delete(id: string): Promise<void>;
}
