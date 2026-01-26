import { TextileSubcategory } from '../../../domain/entities/textileProducts/TextileSubcategory';

export abstract class TextileSubcategoryRepository {
	abstract getAllTextileSubcategories(): Promise<TextileSubcategory[]>;
	abstract getTextileSubcategoryById(
		id: string,
	): Promise<TextileSubcategory | null>;
	abstract saveTextileSubcategory(
		subcategory: TextileSubcategory,
	): Promise<TextileSubcategory>;
	abstract updateTextileSubcategory(
		id: string,
		subcategory: TextileSubcategory,
	): Promise<TextileSubcategory>;
	abstract deleteTextileSubcategory(id: string): Promise<void>;
}
