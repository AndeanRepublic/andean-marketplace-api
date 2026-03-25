import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { FilterCount } from '../../models/shared/PaginatedProductsResponse';
import { TextileProductListItem } from '../../models/textile/TextileProductListItemResponse';

export interface ProductFilters {
	color?: string;
	size?: string;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	perPage?: number;
	categoryId?: string;
	ownerId?: string;
	sortBy?: ProductSortBy;
}

export abstract class TextileProductRepository {
	abstract getAllTextileProducts(): Promise<TextileProduct[]>;
	abstract getAllWithPagination(
		page: number,
		perPage: number,
	): Promise<{ products: TextileProduct[]; total: number }>;
	abstract getAllWithFilters(
		filters: ProductFilters,
	): Promise<{ products: TextileProductListItem[]; total: number }>;
	abstract getFilterCounts(filters?: ProductFilters): Promise<FilterCount>;
	abstract getTextileProductById(id: string): Promise<TextileProduct | null>;
	abstract saveTextileProduct(product: TextileProduct): Promise<TextileProduct>;
	abstract updateTextileProduct(
		id: string,
		product: TextileProduct,
	): Promise<TextileProduct>;
	abstract deleteTextileProduct(id: string): Promise<void>;
	abstract getByIds(ids: string[]): Promise<TextileProduct[]>;
	abstract reduceStock(
		id: string,
		quantity: number,
	): Promise<TextileProduct | null>;
}
