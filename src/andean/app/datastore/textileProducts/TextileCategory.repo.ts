import { TextileCategory } from '../../../domain/entities/textileProducts/TextileCategory';

export abstract class TextileCategoryRepository {
  abstract getAllCategories(): Promise<TextileCategory[]>;
  abstract getCategoryById(id: string): Promise<TextileCategory | null>;
  abstract saveCategory(category: TextileCategory): Promise<TextileCategory>;
  abstract updateCategory(
    id: string,
    category: TextileCategory,
  ): Promise<TextileCategory>;
  abstract deleteCategory(id: string): Promise<void>;
}
