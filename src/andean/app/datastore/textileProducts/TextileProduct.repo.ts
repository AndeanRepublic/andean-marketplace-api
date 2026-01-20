import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { FilterCount } from '../../modules/PaginatedProductsResponse';

export interface ProductFilters {
	color?: string;
	size?: string;
	minPrice?: number;
	maxPrice?: number;
	page?: number;
	perPage?: number;
	categoryId?: string;
	ownerId?: string;
}

export abstract class TextileProductRepository {
	abstract getAllTextileProducts(): Promise<TextileProduct[]>;
	abstract getAllWithPagination(page: number, perPage: number): Promise<{ products: TextileProduct[]; total: number }>;
	abstract getAllWithFilters(filters: ProductFilters): Promise<{ products: TextileProduct[]; total: number }>;
	abstract getFilterCounts(filters?: ProductFilters): Promise<FilterCount>;
	abstract getTextileProductById(id: string): Promise<TextileProduct | null>;
	abstract saveTextileProduct(product: TextileProduct): Promise<TextileProduct>;
	abstract updateTextileProduct(
		id: string,
		product: TextileProduct,
	): Promise<TextileProduct>;
	abstract deleteTextileProduct(id: string): Promise<void>;
}
