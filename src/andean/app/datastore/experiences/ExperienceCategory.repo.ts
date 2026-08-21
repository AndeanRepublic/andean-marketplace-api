import { ExperienceCategory } from '../../../domain/entities/experiences/ExperienceCategory';

export abstract class ExperienceCategoryRepository {
	abstract getCategoryById(id: string): Promise<ExperienceCategory | null>;
	abstract getAllCategories(): Promise<ExperienceCategory[]>;
	abstract saveCategory(
		category: ExperienceCategory,
	): Promise<ExperienceCategory>;
	abstract updateCategory(
		category: ExperienceCategory,
	): Promise<ExperienceCategory>;
	abstract deleteCategory(id: string): Promise<void>;
	abstract saveManyCategories(
		categories: ExperienceCategory[],
	): Promise<ExperienceCategory[]>;
}
