import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';
import { ExperienceCategoryResponse } from '../../../models/experiences/ExperienceCategoryResponse';
import { ExperienceCategoryMapper } from '../../../../infra/services/experiences/ExperienceCategoryMapper';

@Injectable()
export class GetExperienceCategoryByIdUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(id: string): Promise<ExperienceCategoryResponse> {
		const category = await this.categoryRepository.getCategoryById(id);
		if (!category) {
			throw new NotFoundException(`ExperienceCategory with ID ${id} not found`);
		}
		return ExperienceCategoryMapper.toResponse(category);
	}
}
