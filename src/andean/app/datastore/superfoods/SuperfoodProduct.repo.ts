import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { SuperfoodProductListAggregateRow } from '../../models/superfoods/SuperfoodProductListItem';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';

export interface SuperfoodProductFilters {
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	perPage?: number;
	categoryId?: string;
	ownerId?: string;
	sortBy?: ProductSortBy;
	/** Si es true, incluye productos con totalStock <= 0 (p. ej. dashboard admin). */
	includeZeroStock?: boolean;
}

export interface BoxCatalogSuperfoodItem {
	id: string;
	title: string;
	categoryName: string;
	imgId: string;
	catalogPrice: number;
	totalStock: number;
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
	abstract updateStatus(
		id: string,
		status: SuperfoodProductStatus,
	): Promise<SuperfoodProduct | null>;

	/** Listado completo (sin paginar) para el formulario admin de box. */
	abstract getBoxCatalogAll(): Promise<Array<BoxCatalogSuperfoodItem>>;
	/** Variante para box-admin: incluye productos con stock 0. */
	abstract getBoxCatalogAllIncludingZeroStock(): Promise<
		Array<BoxCatalogSuperfoodItem>
	>;
}
