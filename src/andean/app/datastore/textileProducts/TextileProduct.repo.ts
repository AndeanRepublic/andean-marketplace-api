import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';

export abstract class TextileProductRepository {
	abstract getAllTextileProducts(): Promise<TextileProduct[]>;
	abstract getAllWithPagination(page: number, perPage: number): Promise<{ products: TextileProduct[]; total: number }>;
	abstract getTextileProductById(id: string): Promise<TextileProduct | null>;
	abstract saveTextileProduct(product: TextileProduct): Promise<TextileProduct>;
	abstract updateTextileProduct(
		id: string,
		product: TextileProduct,
	): Promise<TextileProduct>;
	abstract deleteTextileProduct(id: string): Promise<void>;
}
