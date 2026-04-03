import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { SuperfoodProductListAggregateRow } from '../../models/superfoods/SuperfoodProductListItem';

export interface SuperfoodProductFilters {
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	perPage?: number;
	categoryId?: string;
	ownerId?: string;
	sortBy?: ProductSortBy;
}

export abstract class SuperfoodProductRepository {
	abstract getSuperfoodProductById(
		id: string,
	): Promise<SuperfoodProduct | null>;

	abstract getAllWithFilters(
		filters: SuperfoodProductFilters,
	): Promise<{ products: SuperfoodProductListAggregateRow[]; total: number }>;

	abstract saveSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct>;

	abstract updateSuperfoodProduct(
		product: SuperfoodProduct,
	): Promise<SuperfoodProduct>;

	abstract deleteSuperfoodProduct(id: string): Promise<void>;

	abstract getByIds(ids: string[]): Promise<SuperfoodProduct[]>;

	abstract reduceStock(
		id: string,
		quantity: number,
	): Promise<SuperfoodProduct | null>;
}
