import { Inject, Injectable } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';
import { ExperienceCategoryResponse } from '../../../models/experiences/ExperienceCategoryResponse';
import { ExperienceCategoryMapper } from '../../../../infra/services/experiences/ExperienceCategoryMapper';

@Injectable()
export class ListExperienceCategoriesUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(): Promise<ExperienceCategoryResponse[]> {
		const categories = await this.categoryRepository.getAllCategories();
		return categories.map((category) =>
			ExperienceCategoryMapper.toResponse(category),
		);
	}
}
