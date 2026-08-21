import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';

@Injectable()
export class DeleteExperienceCategoryUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(id: string): Promise<void> {
		const existing = await this.categoryRepository.getCategoryById(id);
		if (!existing) {
			throw new NotFoundException(`ExperienceCategory with ID ${id} not found`);
		}
		await this.categoryRepository.deleteCategory(id);
	}
}
