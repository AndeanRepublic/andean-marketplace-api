import { SuperfoodCategory } from '../../../domain/entities/superfoods/SuperfoodCategory';

export abstract class SuperfoodCategoryRepository {
	abstract getCategoryById(id: string): Promise<SuperfoodCategory | null>;

	abstract getAllCategories(): Promise<SuperfoodCategory[]>;

	abstract saveCategory(
		category: SuperfoodCategory,
	): Promise<SuperfoodCategory>;

	abstract updateCategory(
		category: SuperfoodCategory,
	): Promise<SuperfoodCategory>;

	abstract deleteCategory(id: string): Promise<void>;

	abstract saveManyCategories(
		categories: SuperfoodCategory[],
	): Promise<SuperfoodCategory[]>;
}
